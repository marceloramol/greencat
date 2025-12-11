/**
 * Interpreta regras internacionais de vencimento
 * @param {Object} product - Produto com expiry_date ou expires_at
 * @param {String} countryCode - Código do país (BR, US, MX, etc)
 * @returns {Object} { status, color, label }
 */
export function expirationInterpreter(product, countryCode) {
  const expiryDate = product.expiry_date || product.expires_at;
  if (!expiryDate) {
    return { status: 'good', color: '#00FF9D', label: 'Válido' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Regras por país
  switch (countryCode?.toUpperCase()) {
    case 'US': // Estados Unidos
      if (daysUntilExpiry < 0) {
        return { status: 'expired', color: '#FF4F4F', label: 'Expired' };
      } else if (daysUntilExpiry === 0) {
        return { status: 'urgent', color: '#FF7A00', label: 'Use By Today' };
      } else if (daysUntilExpiry === 1) {
        return { status: 'urgent', color: '#FF7A00', label: 'Use By Tomorrow' };
      } else if (daysUntilExpiry <= 2) {
        return { status: 'warning', color: '#FFC342', label: 'Best Before 2 Days' };
      } else if (daysUntilExpiry <= 5) {
        return { status: 'warning', color: '#FFC342', label: `Sell By ${daysUntilExpiry} Days` };
      } else {
        return { status: 'good', color: '#00FF9D', label: 'Fresh' };
      }

    case 'MX': // México
      if (daysUntilExpiry < 0) {
        return { status: 'expired', color: '#FF4F4F', label: 'Caducado' };
      } else if (daysUntilExpiry === 0) {
        return { status: 'urgent', color: '#FF7A00', label: 'Caduca Hoy' };
      } else if (daysUntilExpiry === 1) {
        return { status: 'urgent', color: '#FF7A00', label: 'Caduca Mañana' };
      } else if (daysUntilExpiry <= 2) {
        return { status: 'warning', color: '#FFC342', label: 'Consumo Preferente 2 Días' };
      } else if (daysUntilExpiry <= 5) {
        return { status: 'warning', color: '#FFC342', label: `Consumo Preferente ${daysUntilExpiry} Días` };
      } else {
        return { status: 'good', color: '#00FF9D', label: 'Fresco' };
      }

    case 'CA': // Canadá
      if (daysUntilExpiry < 0) {
        return { status: 'expired', color: '#FF4F4F', label: 'Expired' };
      } else if (daysUntilExpiry === 0) {
        return { status: 'urgent', color: '#FF7A00', label: 'Best Before Today' };
      } else if (daysUntilExpiry === 1) {
        return { status: 'urgent', color: '#FF7A00', label: 'Best Before Tomorrow' };
      } else if (daysUntilExpiry <= 3) {
        return { status: 'warning', color: '#FFC342', label: `Best Before ${daysUntilExpiry} Days` };
      } else if (daysUntilExpiry <= 7) {
        return { status: 'good', color: '#00FF9D', label: `Use By ${daysUntilExpiry} Days` };
      } else {
        return { status: 'good', color: '#00FF9D', label: 'Fresh' };
      }

    case 'AU': // Austrália
      if (daysUntilExpiry < 0) {
        return { status: 'expired', color: '#FF4F4F', label: 'Expired' };
      } else if (daysUntilExpiry === 0) {
        return { status: 'urgent', color: '#FF7A00', label: 'Use By Today' };
      } else if (daysUntilExpiry === 1) {
        return { status: 'urgent', color: '#FF7A00', label: 'Use By Tomorrow' };
      } else if (daysUntilExpiry <= 2) {
        return { status: 'warning', color: '#FFC342', label: 'Best Before 2 Days' };
      } else if (daysUntilExpiry <= 5) {
        return { status: 'good', color: '#00FF9D', label: `Best Before ${daysUntilExpiry} Days` };
      } else {
        return { status: 'good', color: '#00FF9D', label: 'Fresh' };
      }

    case 'JP': // Japão
      if (daysUntilExpiry < 0) {
        return { status: 'expired', color: '#FF4F4F', label: '期限切れ' }; // Kigen Kire (Expired)
      } else if (daysUntilExpiry === 0) {
        return { status: 'urgent', color: '#FF7A00', label: '本日期限' }; // Honjitsu Kigen (Expires Today)
      } else if (daysUntilExpiry === 1) {
        return { status: 'urgent', color: '#FF7A00', label: '明日期限' }; // Ashita Kigen (Expires Tomorrow)
      } else if (daysUntilExpiry <= 3) {
        return { status: 'warning', color: '#FFC342', label: `賞味期限${daysUntilExpiry}日` }; // Shōmi Kigen (Best Before)
      } else if (daysUntilExpiry <= 7) {
        return { status: 'good', color: '#00FF9D', label: `消費期限${daysUntilExpiry}日` }; // Shōhi Kigen (Use By)
      } else {
        return { status: 'good', color: '#00FF9D', label: '新鮮' }; // Shinsen (Fresh)
      }

    case 'PT': // Portugal / Europa
    case 'ES': // Espanha
      if (daysUntilExpiry < 0) {
        return { status: 'expired', color: '#FF4F4F', label: 'Expirado' };
      } else if (daysUntilExpiry === 0) {
        return { status: 'urgent', color: '#FF7A00', label: 'Use By Hoje' };
      } else if (daysUntilExpiry === 1) {
        return { status: 'urgent', color: '#FF7A00', label: 'Use By Amanhã' };
      } else if (daysUntilExpiry <= 3) {
        return { status: 'warning', color: '#FFC342', label: `Best Before ${daysUntilExpiry} Dias` };
      } else {
        return { status: 'good', color: '#00FF9D', label: 'Válido' };
      }

    case 'BR': // Brasil (padrão)
    default:
      if (daysUntilExpiry < 0) {
        return { status: 'expired', color: '#FF4F4F', label: 'Vencido' };
      } else if (daysUntilExpiry === 0) {
        return { status: 'urgent', color: '#FF7A00', label: 'Vence Hoje' };
      } else if (daysUntilExpiry === 1) {
        return { status: 'urgent', color: '#FF7A00', label: 'Vence Amanhã' };
      } else if (daysUntilExpiry === 2) {
        return { status: 'warning', color: '#FFC342', label: 'Vence em 2 Dias' };
      } else if (daysUntilExpiry <= 5) {
        return { status: 'good', color: '#00FF9D', label: `Vence em ${daysUntilExpiry} Dias` };
      } else {
        return { status: 'good', color: '#00FF9D', label: 'Válido' };
      }
  }
}