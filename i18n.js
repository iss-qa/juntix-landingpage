/**
 * Runtime de i18n + tema da landing juntix.com.br.
 *
 * - Idiomas: pt (default, texto do próprio HTML), en, es.
 *   As traduções vivem em translations.js (window.JUNTIX_I18N[lang][chave]),
 *   aplicadas em elementos marcados com data-i18n="chave". O conteúdo PT
 *   original é cacheado no primeiro switch para permitir voltar sem reload.
 *   Valores de tradução podem conter markup inline simples (<strong>, <br>).
 * - Tema: [data-theme] no <html>; o valor inicial é aplicado por um script
 *   inline no <head> (evita flash). Aqui só ligamos o botão de toggle.
 */
(function () {
    'use strict';

    var LANG_KEY = 'juntix-lang';
    var THEME_KEY = 'juntix-theme';
    var HTML_LANGS = { pt: 'pt-BR', en: 'en', es: 'es' };

    // Cache do conteúdo PT original: chave data-i18n -> innerHTML
    var originais = null;

    function cachearOriginais() {
        if (originais) return;
        originais = {};
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var chave = el.getAttribute('data-i18n');
            if (chave && !(chave in originais)) originais[chave] = el.innerHTML;
        });
    }

    function aplicarIdioma(lang) {
        var dicionarios = window.JUNTIX_I18N || {};
        if (lang !== 'pt' && !dicionarios[lang]) lang = 'pt';

        cachearOriginais();

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var chave = el.getAttribute('data-i18n');
            if (!chave) return;
            if (lang === 'pt') {
                if (chave in originais) el.innerHTML = originais[chave];
            } else {
                var traducao = dicionarios[lang] && dicionarios[lang][chave];
                if (typeof traducao === 'string') el.innerHTML = traducao;
            }
        });

        document.documentElement.setAttribute('lang', HTML_LANGS[lang] || 'pt-BR');
        var select = document.getElementById('langSelect');
        if (select && select.value !== lang) select.value = lang;

        try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* noop */ }
    }

    function idiomaInicial() {
        try {
            var salvo = localStorage.getItem(LANG_KEY);
            if (salvo === 'pt' || salvo === 'en' || salvo === 'es') return salvo;
        } catch (e) { /* noop */ }
        var nav = (navigator.language || 'pt').toLowerCase();
        if (nav.indexOf('es') === 0) return 'es';
        if (nav.indexOf('en') === 0) return 'en';
        return 'pt';
    }

    function ligarTema() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var atual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            var novo = atual === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', novo);
            try { localStorage.setItem(THEME_KEY, novo); } catch (e) { /* noop */ }
        });
    }

    function init() {
        var select = document.getElementById('langSelect');
        if (select) {
            select.addEventListener('change', function () {
                aplicarIdioma(select.value);
            });
        }
        ligarTema();

        var lang = idiomaInicial();
        if (select) select.value = lang;
        if (lang !== 'pt') aplicarIdioma(lang);
        else cachearOriginais();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
