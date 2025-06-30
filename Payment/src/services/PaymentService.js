const Payment = require('../models/paymentModel');
const Invoice = require('../models/invoiceModel');
const stripeService = require('./stripeService');
const invoiceService = require('./invoiceService');
const { PublishMessage, getChannel } = require('../utils');
const { USER_SERVICE, NOTIFICATION_SERVICE } = require('../Config');
const { PaymentError, ValidationError, NotFoundError } = require('../utils');

class PaymentService {
  // Créer un nouveau paiement
  async createPayment(userId, paymentData) {
    try {
      // Validation des données
      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new ValidationError("Montant invalide");
      }

      // Créer ou récupérer le customer Stripe
      let stripeCustomer;
      try {
        stripeCustomer = await stripeService.createCustomer({
          userId,
          email: paymentData.customerEmail,
          name: paymentData.customerName
        });
      } catch (error) {
        throw new PaymentError(`Erreur création customer: ${error.message}`);
      }

      // Créer le payment intent Stripe
      const paymentIntent = await stripeService.createPaymentIntent(
        paymentData.amount,
        paymentData.currency || 'eur',
        stripeCustomer.id,
        paymentData.description,
        {
          userId: userId.toString(),
          ...paymentData.metadata
        }
      );

      // Créer l'enregistrement Payment
      const payment = new Payment({
        userId,
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId: stripeCustomer.id,
        amount: paymentData.amount,
        currency: paymentData.currency || 'eur',
        description: paymentData.description,
        metadata: paymentData.metadata || {},
        status: paymentIntent.status
      });

      await payment.save();

      return {
        payment,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      throw error;
    }
  }

  // Traiter le succès d'un paiement
  async handlePaymentSuccess(paymentIntentId) {
    try {
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
      if (!payment) {
        throw new NotFoundError("Paiement non trouvé");
      }

      // Mettre à jour le statut
      payment.status = 'succeeded';
      await payment.save();

      // Générer la facture
      const invoice = await this.generateInvoice(payment);
      
      // Notifier le service utilisateur
      await this.notifyUserService(payment.userId, 'payment_success', {
        paymentId: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        invoiceId: invoice._id
      });

      // Envoyer notification email
      await this.sendPaymentNotification(payment, invoice, 'success');

      return { payment, invoice };
    } catch (error) {
      throw error;
    }
  }

  // Générer une facture
  async generateInvoice(payment) {
    try {
      // Calculer les montants
      const subtotal = payment.amount;
      const taxRate = 20; // 20% de TVA
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      // Créer la facture
      const invoice = new Invoice({
        userId: payment.userId,
        paymentId: payment._id,
        customerInfo: {
          name: "Client Jolt", // À récupérer depuis le service User
          email: "client@example.com", // À récupérer depuis le service User
        },
        items: [{
          description: payment.description,
          quantity: 1,
          unitPrice: subtotal,
          totalPrice: subtotal
        }],
        subtotal,
        taxRate,
        taxAmount,
        total,
        currency: payment.currency.toUpperCase(),
        dueDate: new Date(), // Payé immédiatement
        paidAt: new Date()
      });

      await invoice.save();

      // Générer le PDF
      const pdfResult = await invoiceService.generateInvoicePDF(invoice);
      
      // Mettre à jour avec les infos du PDF
      invoice.pdfPath = pdfResult.filePath;
      invoice.pdfUrl = pdfResult.fileUrl;
      await invoice.save();

      // Lier la facture au paiement
      payment.invoiceId = invoice._id;
      await payment.save();

      return invoice;
    } catch (error) {
      throw new PaymentError(`Erreur génération facture: ${error.message}`);
    }
  }

  // Notifier le service utilisateur via RabbitMQ
  async notifyUserService(userId, eventType, data) {
    try {
      const channel = await getChannel();
      const message = JSON.stringify({
        userId,
        eventType,
        data,
        timestamp: new Date().toISOString()
      });

      PublishMessage(channel, USER_SERVICE, message);
      console.log(`📨 Message envoyé au service User: ${eventType}`);
    } catch (error) {
      console.error("❌ Erreur notification service User:", error);
    }
  }

  // Envoyer notification email
  async sendPaymentNotification(payment, invoice, type) {
    try {
      const channel = await getChannel();
      const message = JSON.stringify({
        type: 'payment_notification',
        to: invoice.customerInfo.email,
        subject: type === 'success' ? 'Confirmation de paiement' : 'Échec du paiement',
        data: {
          paymentId: payment._id,
          amount: payment.amount,
          currency: payment.currency,
          invoiceNumber: invoice.invoiceNumber,
          invoiceUrl: invoice.pdfUrl,
          status: payment.status
        }
      });

      PublishMessage(channel, NOTIFICATION_SERVICE, message);
      console.log(`📧 Notification email envoyée: ${type}`);
    } catch (error) {
      console.error("❌ Erreur notification email:", error);
    }
  }

  // Récupérer les paiements d'un utilisateur
  async getUserPayments(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const payments = await Payment.find({ userId })
        .populate('invoiceId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Payment.countDocuments({ userId });

      return {
        payments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Traiter un remboursement
  async processRefund(paymentId, refundData) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new NotFoundError("Paiement non trouvé");
      }

      if (payment.status !== 'succeeded') {
        throw new ValidationError("Seuls les paiements réussis peuvent être remboursés");
      }

      // Créer le remboursement Stripe
      const refund = await stripeService.createRefund(
        payment.stripePaymentIntentId,
        refundData.amount,
        refundData.reason
      );

      // Mettre à jour le paiement
      payment.status = refundData.amount === payment.amount ? 'refunded' : 'partially_refunded';
      payment.refundAmount = (payment.refundAmount || 0) + (refundData.amount || payment.amount);
      payment.refundReason = refundData.reason;
      await payment.save();

      // Notifier les services
      await this.notifyUserService(payment.userId, 'payment_refunded', {
        paymentId: payment._id,
        refundAmount: refundData.amount || payment.amount,
        reason: refundData.reason
      });

      return payment;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PaymentService();