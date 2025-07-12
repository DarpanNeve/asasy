import React, { useState } from 'react';
import { Zap, Crown, Rocket, Diamond, ShoppingCart, Mail } from 'lucide-react';

const TokenPricingCard = ({ 
  pkg, 
  isHovered, 
  onHover, 
  onPurchase, 
  isPurchasing, 
  user,
  compact = false 
}) => {
  const IconComponent = pkg.icon;
  const isEnterprise = pkg.isContactOnly;
  
  return (
    <div
      className={`relative transform transition-all duration-300 ${
        isHovered ? 'scale-105' : 'scale-100'
      } ${pkg.popular && !compact ? 'lg:-translate-y-4' : ''}`}
      onMouseEnter={() => onHover(pkg.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Popular Badge */}
      {pkg.popular && !compact && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      {/* Card */}
      <div className={`relative h-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 ${
        pkg.popular && !compact ? 'border-orange-200' : 'border-gray-100'
      } ${isHovered ? 'shadow-2xl border-gray-200' : ''}`}>
        
        {/* Header Gradient */}
        <div className={`h-2 bg-gradient-to-r ${isHovered ? pkg.hoverColor : pkg.color}`} />
        
        {/* Content */}
        <div className={`${compact ? 'p-4' : 'p-6'} text-center`}>
          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className={`${compact ? 'p-2' : 'p-3'} rounded-full bg-gradient-to-r ${pkg.color} shadow-lg`}>
              <IconComponent className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
            </div>
          </div>
          
          {/* Name */}
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-3`}>
            {pkg.name}
          </h3>
          
          {/* Price */}
          <div className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
            {typeof pkg.price_usd === 'string' ? pkg.price_usd : `$${pkg.price_usd.toFixed(2)}`}
          </div>
          
          {/* Tokens */}
          <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 mb-6`}>
            {isEnterprise ? 'Custom Tokens' : `${pkg.tokens.toLocaleString()} Tokens`}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onPurchase(pkg)}
            disabled={isPurchasing || (!user && !isEnterprise)}
            className={`w-full py-2 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
              isHovered && !isPurchasing ? 'scale-105' : 'scale-100'
            } bg-gradient-to-r ${pkg.color} hover:${pkg.hoverColor} shadow-lg hover:shadow-xl ${compact ? 'text-xs' : 'text-sm'} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPurchasing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : isEnterprise ? (
              <>
                <Mail className="w-4 h-4 mr-2 inline" />
                Contact Us
              </>
            ) : !user ? (
              'Login to Purchase'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2 inline" />
                Purchase
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPricingCard;