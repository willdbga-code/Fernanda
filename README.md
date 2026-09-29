# Fernanda & João — Ensaio Gestante | Direção Editorial & Moodboard

Este projeto é um site moodboard e direção de fotografia editorial de alto padrão para o ensaio de gestante da **Fernanda & João** ([@oroledocasal](https://www.instagram.com/oroledocasal/)).

Inspirado na excelência estética, animações fluidas e design arquitetônico do site [Realevate Evergreen](https://realevate.agency/evergreen).

---

## 🌟 Visão Geral do Projeto

O ensaio foi concebido com rigor editorial em **duas atmosferas contrastantes e complementares**:

1. **Atmosfera 01: Praia Dourada (Golden Hour)**
   - **Conceito:** Natureza selvagem, maresia, calor do pôr do sol, linho cru e liberdade.
   - **Direção Técnica:** Lente 50mm Prime f/1.8 a f/2.2. Sol em contra-luz rasante gerando *rim light* dourado nos cabelos e ombros. Rebatedor 2-em-1 (face prata a 45° para brilho nos olhos e face branca suave para preencher a sombra no ventre). Flash compacto em modo High-Speed Sync (HSS) a 1/32 com cúpula difusora.
   - **Referências:** Curadoria de 10 referências em `Praia/` e obra original gerada em `assets/`.

2. **Atmosfera 02: Studio Noir (Chiaroscuro)**
   - **Conceito:** Minimalismo europeu de alta-costura (estilo *Vogue Bambini*), sobriedade atemporal e foco absoluto na escultura do corpo e na cumplicidade do casal.
   - **Direção Técnica:** Lente 50mm Prime f/2.5 a f/3.2 (profundidade suficiente para manter os rostos e o ventre nítidos). Modificador Octabox de 90cm com grade colmeia (*Honeycomb Grid*) a 45° superior para iluminar apenas a silhueta da gestação sem vazar luz no fundo. Painel V-Flat preto no lado oposto como *Negative Fill* para aprofundar sombras esculturais.
   - **Referências:** Curadoria de 10 referências em `Studio/` e obra original gerada em `assets/`.

---

## 🎨 Recursos Interativos do Site (`index.html`)

- **Design System Realevate Evergreen:** Paleta em obsidian noir profundo (`#08090C`), acentos em ouro champanhe (`#D4A373`), bordas arquitetônicas ultrafinas e tipografia editorial de luxo (`Cormorant Garamond`, `Syne` e `Plus Jakarta Sans`).
- **Preloader Editorial:** Animação de contagem `00% -> 100%` com revelação fluida e coordenadas geográficas do ensaio.
- **Cursor de Luxo Magnético:** Cursor customizado com anel magnético e tags contextuais dinâmicas (`[ EXPLORAR ]`, `[ COMPARAR ]`, `[ AMPLIAR ]`, `[ ÁUDIO ]`, `[ AJUSTAR LUZ ]`).
- **Motor de Áudio Ambiente (Web Audio API):** Síntese sonora em tempo real sem dependências externas! Reproduz o som suave de ondas do mar moduladas com ruído filtrado por LFO e o calor acolhedor de vinil de estúdio.
- **Barra de Atmosferas Flutuante:** Controle flutuante para transição dinâmica entre `Visão Completa`, `01. Praia Dourada` e `02. Studio Noir` (design limpo sem lâmpadas/pontos pulsantes).
- **O Regulador (Split-Screen Comparador Expandido):** Slider de arrasto touch/mouse na proporção nativa 896x1200 que permite visualizar a transição entre Praia e Studio de corpo inteiro sem cortar cabeças ou corpos, com legendas independentes livres de clipping.
- **Carrosséis Horizontais de Inspiração:** Navegação por arrasto mouse/touch com inércia e botões direcionais (‹ / ›) para navegação fluida em desktop e dispositivos móveis.
- **Simulador Interativo de Esquema de Luz:** Diagramas vetoriais SVG interativos para Praia e Studio, onde clicar nos nós (Sol, Rebatedor, Octabox c/ Grid, V-Flat, Câmera 50mm) exibe as diretrizes em tempo real.
- **Grade Editorial Arquitetônica com Lightbox:** Layout em CSS Grid inspirado no Realevate Evergreen com destaque em 2 colunas para as obras originais e fluxo ritmado para as referências, com modal fullscreen responsivo e navegação por setas laterais.
- **Checklist do Fotógrafo Persistente:** Lista de equipamentos e tarefas pré-ensaio com barra de progresso em tempo real e salvamento automático no `localStorage`.

---

## 📂 Estrutura de Arquivos

```
Fernanda/
├── index.html          # Aplicação web editorial completa e responsiva
├── styles.css          # Design system Realevate Evergreen, tipografia, grids e animações
├── app.js              # Lógica interativa, áudio Web Audio API, lightbox, slider e simulador
├── README.md           # Documentação técnica e guia do ensaio
├── assets/             # Obras originais geradas e detalhes de iluminação
├── Praia/              # Referências estéticas para o ensaio na praia (10 itens)
└── Studio/             # Referências estéticas para o ensaio no studio (10 itens)
```

---

## 🚀 Como Visualizar o Site

Basta abrir o arquivo `index.html` em qualquer navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, Opera).

1. Abra o Windows Explorer na pasta `c:\Users\LENOVO\Desktop\Fernanda`.
2. Dê um duplo-clique em `index.html` (ou clique com o botão direito e escolha "Abrir com" -> seu navegador favorito).
3. Aproveite a experiência interativa imersiva!
