/*
 * Simulador de Caixa da landing page.
 *
 * Mesma conta do simulador do painel (frontend/src/utils/caixaComposicao.ts,
 * taxaAdesao.ts e scoreMinimo.ts):
 *  - cota = valor ÷ meses (cada mês entra um participante);
 *  - taxa de adesão progressiva (2% a 2,5%, teto R$ 500,00), paga à parte por
 *    Pix ANTES do Mês 1 (regra dos caixas desde 08/10/2026);
 *  - taxa de serviço em todas as parcelas;
 *  - correção da cota a partir do 2º mês (IPCA estimado 0,41% ao mês);
 *  - comissão do recrutador (10% do caixa) só na última parcela;
 *  - score mínimo por valor do caixa.
 */
(function () {
    'use strict';

    var raiz = document.getElementById('simulador');
    if (!raiz) return;

    var IPCA_MES = 0.0041;
    var TAXA_SERVICO = 20;
    var COMISSAO_PCT = 0.1;
    var VALOR_MIN = 1000;
    var VALOR_MAX = 20000;

    var brl = function (v) {
        return (Math.round(v * 100) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    function taxaAdesao(valor) {
        if (!valor || valor <= 0) return 0;
        var percMin = 20 / 1000;
        if (valor <= 1000) return Math.round(valor * percMin * 100) / 100;
        if (valor >= 20000) return 500;
        var t = (valor - 1000) / (20000 - 1000);
        var aliquota = percMin + t * (0.025 - percMin);
        return Math.round(valor * aliquota * 100) / 100;
    }

    function scoreMinimo(valor) {
        var k = (valor || 0) / 1000;
        var min;
        if (k < 4) min = 30 + k * 5;
        else if (k < 5) min = 50 + (k - 4) * 11;
        else if (k < 8) min = 55 + (k - 3) * 3;
        else if (k <= 10) min = 75 + (k - 8) * 2.5;
        else min = 80 + (k - 10) * 1.1;
        return Math.min(100, Math.max(31, Math.round(min)));
    }

    function composicao(valor, meses) {
        var base = valor / meses;
        var comissao = (valor * COMISSAO_PCT) / meses;
        var parcelas = [];
        for (var pos = 1; pos <= meses; pos++) {
            var ipca = pos === 1 ? 0 : base * (Math.pow(1 + IPCA_MES, pos - 1) - 1);
            var com = pos === meses ? comissao : 0;
            parcelas.push({
                pos: pos,
                base: base,
                ipca: ipca,
                servico: TAXA_SERVICO,
                comissao: com,
                total: base + ipca + TAXA_SERVICO + com,
            });
        }
        return { base: base, adesao: taxaAdesao(valor), comissao: comissao, parcelas: parcelas };
    }

    var estado = { valor: null, meses: null };
    var elValores = raiz.querySelector('[data-sim-valores]');
    var elOutro = raiz.querySelector('[data-sim-outro]');
    var elMeses = raiz.querySelector('[data-sim-meses]');
    var elResultado = raiz.querySelector('[data-sim-resultado]');
    var elCta = raiz.querySelector('[data-sim-cta]');

    function marcar(container, attr, valor) {
        container.querySelectorAll('[' + attr + ']').forEach(function (b) {
            b.classList.toggle('ativo', Number(b.getAttribute(attr)) === valor);
        });
    }

    function render() {
        if (!estado.valor || !estado.meses) {
            elResultado.hidden = true;
            return;
        }
        var c = composicao(estado.valor, estado.meses);
        var p = c.parcelas;
        var meio = p.slice(1, -1);
        var totalParcelas = p.reduce(function (s, x) { return s + x.total; }, 0);
        var totalPago = totalParcelas + c.adesao;
        var servicoIpca = p.reduce(function (s, x) { return s + x.servico + x.ipca; }, 0);
        var minScore = scoreMinimo(estado.valor);

        elResultado.querySelector('[data-r-recebe]').textContent = brl(estado.valor);
        elResultado.querySelector('[data-r-meses]').textContent = estado.meses + ' meses · ' + estado.meses + ' participantes';
        elResultado.querySelector('[data-r-adesao]').textContent = brl(c.adesao);
        elResultado.querySelector('[data-r-primeira]').textContent = brl(p[0].total);
        elResultado.querySelector('[data-r-meio]').textContent = meio.length
            ? brl(meio[0].total) + ' a ' + brl(meio[meio.length - 1].total)
            : '—';
        elResultado.querySelector('[data-r-ultima]').textContent = brl(p[p.length - 1].total);
        elResultado.querySelector('[data-r-comissao]').textContent = brl(c.comissao);
        elResultado.querySelector('[data-r-servico]').textContent = brl(servicoIpca);
        elResultado.querySelector('[data-r-total]').textContent = brl(totalPago);
        elResultado.querySelector('[data-r-score]').textContent =
            'Score mínimo para este valor: ' + minScore +
            (estado.valor >= 8000 ? ' · exige 1 caixa concluído na Juntix' : '');

        var tabela = elResultado.querySelector('[data-r-tabela]');
        tabela.innerHTML = p
            .map(function (x) {
                var extras = [];
                if (x.ipca > 0) extras.push('IPCA ' + brl(x.ipca));
                extras.push('serviço ' + brl(x.servico));
                if (x.comissao > 0) extras.push('comissão ' + brl(x.comissao));
                return '<tr><td>Mês ' + x.pos + '</td><td>' + brl(x.base) + '</td><td>' +
                    extras.join(' + ') + '</td><td><strong>' + brl(x.total) + '</strong></td></tr>';
            })
            .join('');

        // O botão do WhatsApp leva o caixa simulado (o script.js põe o ref).
        if (elCta) {
            elCta.setAttribute(
                'data-assistente-texto',
                'Oi Juntix! Simulei um caixa de ' + brl(estado.valor) + ' em ' +
                    estado.meses + ' meses e quero saber mais.',
            );
        }
        elResultado.hidden = false;
    }

    elValores.addEventListener('click', function (e) {
        var b = e.target.closest('[data-valor]');
        if (!b) return;
        estado.valor = Number(b.getAttribute('data-valor'));
        elOutro.value = '';
        marcar(elValores, 'data-valor', estado.valor);
        render();
    });

    elOutro.addEventListener('input', function () {
        var n = Number(String(elOutro.value).replace(/\D/g, ''));
        if (n >= VALOR_MIN && n <= VALOR_MAX) {
            estado.valor = n;
            marcar(elValores, 'data-valor', -1);
            elOutro.classList.remove('invalido');
        } else {
            estado.valor = null;
            elOutro.classList.toggle('invalido', String(elOutro.value).length > 0);
        }
        render();
    });

    elMeses.addEventListener('click', function (e) {
        var b = e.target.closest('[data-meses]');
        if (!b) return;
        estado.meses = Number(b.getAttribute('data-meses'));
        marcar(elMeses, 'data-meses', estado.meses);
        render();
    });

    // Score mínimo em cada cartão de valor.
    elValores.querySelectorAll('[data-valor]').forEach(function (b) {
        var tag = b.querySelector('[data-score]');
        if (tag) tag.textContent = 'Score ' + scoreMinimo(Number(b.getAttribute('data-valor'))) + '+';
    });
})();
