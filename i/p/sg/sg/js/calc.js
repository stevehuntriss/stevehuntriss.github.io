/*
 * jQuery Price Calculator 1.0
 * http://benmartinstudios.com/
 *
 * Copyright 2011, Ben Martin
 * Must not be used without permission
 * Contact ben.martin@benmartinstudios.com for more details
 *
 */

(function($){function floatInParent(elem,margin){if(typeof margin==='undefined'){margin=20;}
if(elem.length===0){return false;}
var parent=elem.parent();elem.css('top',0);var minY=elem.offset().top-margin,maxY=parent.offset().top+parent.height()-elem.height(),pPosInit=parent.offset().top,origPos=elem.css('position');var positionElem=function(){var pPos=parent.offset().top;var scroll=$('html').scrollTop()-(pPos-pPosInit);if(scroll>minY&&scroll<maxY){elem.css('position','fixed').css('margin-top',margin+'px');}else{elem.css('position',origPos).css('margin-top','0');}}
$(window).unbind('scroll').scroll(positionElem);positionElem();}
var BPrice=function(elem,options){var getPrice=function(elem){cost=getActualElem(elem).data('cost');if(typeof cost==='undefined'){cost=0;}
if(isNaN(parseFloat(cost,10))){cost=0;}
return parseFloat(cost,10);}
var calculatePrice=function(){var total=0;optionsDiv.find(':input').each(function(){var elem=$(this);if((elem.is('select')||elem.prop('checked'))&&!elem.prop('disabled')){total+=getPrice(elem);}});subDiv.find('.total span').text(settings.signBefore+total.toFixed(2)+settings.signAfter);}
var showHidePrices=function(show){if(typeof show==='undefined'){show=!settings.showPrices;}else if(typeof show!=='boolean'){show=true;}
var prices=optionsDiv.find('.bPrice-price');if(show){prices.stop().fadeTo(settings.pricesFadeTime,1);}else{prices.stop().fadeTo(settings.pricesFadeTime,0);}}
var updatePrices=function(){optionsDiv.find(':input').each(function(){var elem=$(this);var priceTag=elem.parent().find('.bPrice-price');if(elem.is('textarea')){if(elem.next().is('.bPrice-price')){elem.next().remove();}}
if(priceTag.length!==0){if(priceTag.is(':empty')){priceTag.append(' - <span></span>');}
price=getPrice(elem);fPrice=settings.signBefore+price.toFixed(2)+settings.signAfter;if(price===0){if(settings.showZeroAs===false){priceTag.empty();}else{fPrice=settings.showZeroAs;if(parseInt(fPrice,10)===0){fPrice=settings.signBefore+price.toFixed(2)+settings.signAfter;}}}
priceTag.children('span').text(fPrice);}});}
var getActualElem=function(elem){aElem=elem;if(elem.is('select')){aElem=elem.find(':selected');}
return aElem;}
var getConfig=function(){optionsDiv.find(':input').each(function(){elem=getActualElem($(this));});}
var settings=$.extend({floatSub:false,subAlign:'right',showPrices:true,showPricesOption:true,showZeroAs:false,signBefore:'$',signAfter:'  ',pricesFadeTime:600,configurationText:''},options|{});var element=$(elem);var selector=element.attr('id');element.addClass('bPrice');element.wrapInner('<div class="options"/>');element.append('<div class="sub"/>');element.append('<div style="clear: both;"/>');var optionsDiv=element.children('.options');var subDiv=element.children('.sub');var priceDiv=subDiv.append('<div class="total-price"/>').find('.total-price');var confDiv=subDiv.append('<div class="conf"/>').find('.conf');if(settings.subAlign==='left'){element.addClass('left');}else{element.addClass('right');}
var optionsWidth=element.width()-parseInt(subDiv.outerWidth(),10)
-((settings.subAlign==='left')?parseInt(subDiv.css('margin-right'),10):parseInt(subDiv.css('margin-left'),10));optionsDiv.css('width',optionsWidth+'px');priceDiv.append('<p class="total">Total: <span>...</span></p>');if(settings.showPrices||settings.showPricesOption){optionsDiv.find(':input').each(function(){var elem=$(this);elem.parent().append(' ');});}

if(settings.subAlign==='left'){subDiv.css('margin-left','0');}else{subDiv.css('margin-left',(optionsDiv.outerWidth()+parseInt(subDiv.css('margin-left'),10))+'px');}
optionsDiv.find(':input').change(function(){calculatePrice();updatePrices();getConfig();});calculatePrice();updatePrices();getConfig();floatInParent(subDiv);}
$.fn.bPrice=function(options){return this.each(function(){var element=$(this);var elem=this;if(element.data('bPrice'))return;var bPrice=new BPrice(element,options);element.data('bPrice',bPrice);});};})(jQuery);