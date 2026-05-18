(function () {
  'use strict';

  var STORAGE_KEY = 'juntix_cookie_consent_v1';
  var CONSENT_VERSION = 1;
  var FB_APP_ID = '1490465612677168';

  var defaultConsent = {
    version: CONSENT_VERSION,
    essential: true,
    functional: false,
    marketing: false,
    timestamp: null
  };

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.version === CONSENT_VERSION) return parsed;
      return null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(consent) {
    var payload = Object.assign({}, defaultConsent, consent, {
      version: CONSENT_VERSION,
      essential: true,
      timestamp: new Date().toISOString()
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}
    return payload;
  }

  function loadFacebookSdk() {
    if (window.__juntixFbLoaded) return;
    window.__juntixFbLoaded = true;

    window.fbAsyncInit = function () {
      if (!window.FB) return;
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v25.0'
      });
      window.FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      var js = d.createElement(s);
      js.id = id;
      js.async = true;
      js.src = 'https://connect.facebook.net/pt_BR/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  function applyConsent(consent) {
    if (consent && consent.marketing) {
      loadFacebookSdk();
    }
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2), attrs[k]);
        } else {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach(function (c) {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function buildBanner(onAcceptAll, onRejectAll, onCustomize) {
    var banner = el('div', { id: 'juntix-cookie-banner', role: 'dialog', 'aria-live': 'polite', 'aria-label': 'Aviso de cookies' }, [
      el('div', { class: 'jcc-banner-inner' }, [
        el('div', { class: 'jcc-banner-text' }, [
          el('strong', null, ['Sua privacidade importa.']),
          el('span', null, [
            ' Usamos cookies essenciais para o funcionamento do site e, com seu consentimento, cookies de marketing (Facebook) para entender melhor o que funciona. Saiba mais na nossa ',
          ]),
          el('a', { href: 'politica-privacidade.html' }, ['Política de Privacidade']),
          el('span', null, ['.'])
        ]),
        el('div', { class: 'jcc-banner-actions' }, [
          el('button', { type: 'button', class: 'jcc-btn jcc-btn-ghost', onclick: onCustomize }, ['Personalizar']),
          el('button', { type: 'button', class: 'jcc-btn jcc-btn-ghost', onclick: onRejectAll }, ['Recusar não essenciais']),
          el('button', { type: 'button', class: 'jcc-btn jcc-btn-primary', onclick: onAcceptAll }, ['Aceitar todos'])
        ])
      ])
    ]);
    return banner;
  }

  function buildPrefsModal(current, onSave, onClose) {
    var marketingChecked = !!current.marketing;
    var functionalChecked = !!current.functional;

    var marketingInput = el('input', { type: 'checkbox', id: 'jcc-cat-marketing' });
    if (marketingChecked) marketingInput.checked = true;
    var functionalInput = el('input', { type: 'checkbox', id: 'jcc-cat-functional' });
    if (functionalChecked) functionalInput.checked = true;

    var modal = el('div', { id: 'juntix-cookie-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Preferências de cookies' }, [
      el('div', { class: 'jcc-modal-backdrop', onclick: onClose }, []),
      el('div', { class: 'jcc-modal-card' }, [
        el('h2', { class: 'jcc-modal-title' }, ['Preferências de cookies']),
        el('p', { class: 'jcc-modal-desc' }, ['Você decide o que cada categoria pode coletar. Cookies essenciais não podem ser desativados porque são necessários para o site funcionar.']),

        el('div', { class: 'jcc-cat' }, [
          el('div', { class: 'jcc-cat-head' }, [
            el('strong', null, ['Essenciais']),
            el('span', { class: 'jcc-badge' }, ['Sempre ativos'])
          ]),
          el('p', { class: 'jcc-cat-desc' }, ['Necessários para navegação, segurança e preferências básicas como idioma. Não armazenam dados pessoais identificáveis além do estritamente necessário.'])
        ]),

        el('div', { class: 'jcc-cat' }, [
          el('label', { class: 'jcc-cat-head', for: 'jcc-cat-functional' }, [
            el('strong', null, ['Funcionais']),
            functionalInput
          ]),
          el('p', { class: 'jcc-cat-desc' }, ['Lembram suas escolhas (ex.: agendamentos via Google Calendar). Sem eles, alguns recursos podem não funcionar como esperado.'])
        ]),

        el('div', { class: 'jcc-cat' }, [
          el('label', { class: 'jcc-cat-head', for: 'jcc-cat-marketing' }, [
            el('strong', null, ['Marketing']),
            marketingInput
          ]),
          el('p', { class: 'jcc-cat-desc' }, ['Permitem que carreguemos o SDK do Facebook (Meta) para medir desempenho de campanhas. Envolvem transferência de dados para a Meta Platforms, Inc. (EUA).'])
        ]),

        el('div', { class: 'jcc-modal-actions' }, [
          el('button', { type: 'button', class: 'jcc-btn jcc-btn-ghost', onclick: onClose }, ['Cancelar']),
          el('button', {
            type: 'button',
            class: 'jcc-btn jcc-btn-primary',
            onclick: function () {
              onSave({
                functional: functionalInput.checked,
                marketing: marketingInput.checked
              });
            }
          }, ['Salvar preferências'])
        ])
      ])
    ]);

    return modal;
  }

  function removeNode(id) {
    var n = document.getElementById(id);
    if (n && n.parentNode) n.parentNode.removeChild(n);
  }

  function showBanner() {
    if (document.getElementById('juntix-cookie-banner')) return;
    var banner = buildBanner(
      function () { saveAndClose({ functional: true, marketing: true }); },
      function () { saveAndClose({ functional: false, marketing: false }); },
      function () { openPrefs(); }
    );
    document.body.appendChild(banner);
  }

  function openPrefs() {
    removeNode('juntix-cookie-modal');
    var current = readConsent() || defaultConsent;
    var modal = buildPrefsModal(
      current,
      function (choice) {
        saveAndClose(choice);
        removeNode('juntix-cookie-modal');
      },
      function () { removeNode('juntix-cookie-modal'); }
    );
    document.body.appendChild(modal);
  }

  function saveAndClose(choice) {
    var saved = writeConsent(choice);
    removeNode('juntix-cookie-banner');
    applyConsent(saved);
  }

  function init() {
    var existing = readConsent();
    if (existing) {
      applyConsent(existing);
    } else {
      showBanner();
    }

    window.JuntixCookieConsent = {
      open: openPrefs,
      get: readConsent,
      reset: function () {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        showBanner();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
