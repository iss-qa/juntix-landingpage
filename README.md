# 🚀 Juntix - Landing Page

Landing page oficial do **Juntix**, a plataforma que permite criar caixas coletivos entre amigos sem juros e sem burocracia.

## 📋 Sobre o Projeto

Esta é uma landing page moderna e responsiva desenvolvida para apresentar o Juntix aos usuários. A página destaca os principais benefícios da plataforma, compara com outras modalidades de crédito, explica como funciona o sistema e responde às perguntas mais frequentes.

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com variáveis CSS e gradientes
- **JavaScript (Vanilla)** - Interatividade e animações
- **Google Fonts (Inter)** - Tipografia profissional

## 📁 Estrutura do Projeto

```
landingpage/
├── index.html          # Página principal
├── styles.css          # Estilos e design system
├── script.js           # Funcionalidades JavaScript
├── logo/               # Imagens e logos
│   └── logo_juntix.png
└── README.md           # Este arquivo
```

## 🚀 Como Executar o Projeto

### Opção 1: Abrir Diretamente no Navegador

1. Navegue até a pasta do projeto:
   ```bash
   cd /Users/isaiassilva/development/projects/caixaJunto/landingpage
   ```

2. Abra o arquivo `index.html` diretamente no seu navegador preferido:
   - **macOS**: 
     ```bash
     open index.html
     ```
   - Ou clique duas vezes no arquivo `index.html` no Finder

### Opção 2: Usar um Servidor Local (Recomendado)

Para uma melhor experiência e evitar problemas com CORS:

#### Usando Python (se já estiver instalado):

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://localhost:8000`

#### Usando Node.js com http-server:

```bash
# Instalar http-server globalmente (apenas uma vez)
npm install -g http-server

# Executar o servidor
http-server -p 8000
```

Depois acesse: `http://localhost:8000`

#### Usando Live Server (VS Code):

1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

## ✨ Funcionalidades

### 🎨 Design e UX
- ✅ Design moderno com gradientes e animações suaves
- ✅ Totalmente responsivo (mobile, tablet, desktop)
- ✅ Animações ao scroll para melhor engajamento
- ✅ Navegação fixa com efeito de scroll
- ✅ Menu mobile hamburger

### 📱 Seções da Página
- **Hero** - Apresentação principal com CTAs
- **Como Funciona** - Explicação em 4 passos simples
- **Para Você** - Benefícios para participantes
- **Compare e Economize** - Tabela comparativa com outras modalidades
- **Exemplo Prático** - Demonstração de valores reais
- **Taxas Transparentes** - Detalhamento de todas as taxas
- **Ganhe como Administrador** - Oportunidade de renda extra
- **FAQ** - Perguntas frequentes com accordion
- **Documentos** - Links para contrato e termos de uso
- **Footer** - Informações da empresa e navegação

### 🔧 Funcionalidades JavaScript
- Menu mobile responsivo
- Accordion no FAQ
- Scroll suave para âncoras
- Animações ao scroll (Intersection Observer)
- Navegação ativa baseada na posição do scroll
- Tracking de cliques em CTAs (pronto para analytics)

## 🎨 Design System

O projeto utiliza um design system completo com variáveis CSS:

### Cores Principais
- **Primary**: `#0D9F6E` (Verde principal)
- **Primary Dark**: `#047857`
- **Primary Light**: `#10B981`
- **Accent**: `#34D399`

### Tipografia
- **Font Family**: Inter (Google Fonts)
- **Tamanhos**: De 0.75rem (xs) até 3.75rem (6xl)

### Espaçamentos
- Sistema de espaçamento consistente de `0.25rem` até `6rem`

### Efeitos
- Sombras suaves e gradientes modernos
- Transições suaves (150ms, 300ms, 500ms)
- Border radius variados para diferentes componentes

## 🔗 Integração com a Aplicação Principal

A landing page possui links para a aplicação principal em:
- Botões "Começar Grátis"
- Botões "Quero Participar"
- Botões "Quero ser Administrador"

**URL atual**: `http://localhost:5173/registro`

### ⚠️ Importante: Atualizar URLs de Produção

Antes de fazer deploy, atualize todas as URLs no arquivo `index.html`:

```html
<!-- Procure por: -->
http://localhost:5173/registro

<!-- E substitua pela URL de produção: -->
https://app.juntix.com.br/registro
```

Locais para atualizar:
- Linha 39: Menu de navegação
- Linha 65: Hero CTA principal
- Linha 260: Seção participante
- Linha 483: Seção administrador
- Linha 717: CTA final

## 📦 Deploy

### Para Netlify:
1. Faça upload da pasta `landingpage` completa
2. Configure o build:
   - Build command: (deixe vazio)
   - Publish directory: `.`

### Para Vercel:
```bash
vercel --prod
```

### Para GitHub Pages:
1. Crie um repositório no GitHub
2. Faça push dos arquivos
3. Ative GitHub Pages nas configurações do repositório
4. Selecione a branch e a pasta raiz

## 📞 Contato e Suporte

- **Email**: suporte@juntix.com.br
- **WhatsApp**: 71 3599-0522
- **Empresa**: ISS Software Quality Solutions
- **CNPJ**: 39.997.807/0001-86

## 📄 Licença

© 2026 Juntix - ISS Software Quality Solutions. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para transformar a forma como as pessoas acessam crédito no Brasil**
