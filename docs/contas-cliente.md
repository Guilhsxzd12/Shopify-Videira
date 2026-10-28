# Identidade visual das contas de cliente

Proposta para a área hospedada em `contas.videiravinhoteca.shop`.
Abra `contas-cliente.html` no navegador para visualizar a referência estática.
Ela usa dados demonstrativos e não autentica clientes nem consulta pedidos.

A referência carrega diretamente `assets/videira.css` e
`assets/shopify-integration.css`, além das fontes Poppins, do logo e da fotografia
já usados pelo tema. Mantém o cabeçalho flutuante vinho, a composição editorial,
os botões de 9 px e os cartões de 14 px definidos no CSS atual. O CSS local
cuida apenas da composição específica de conta e de sua adaptação ao celular.
Para manter esses arquivos relativos funcionando, baixe o repositório inteiro;
a visualização de código do GitHub não renderiza o HTML como página.

## Aplicar na Shopify

No Admin, abra Configurações → Checkout → Personalizar na configuração ativa
e selecione as páginas de contas de cliente, quando disponíveis no seletor.
Os nomes e opções podem variar conforme a configuração da loja.

| Elemento | Referência |
| --- | --- |
| Logo | `assets/videira-logo.svg` (use um formato aceito pelo editor) |
| Cor principal, links e botões | `#651242` |
| Fundo da área interna | `#FCF9F3` |
| Creme institucional | `#FDF6E1` |
| Destaque dourado e foco | `#F8AF3C` |
| Superfícies dos cartões | `#FFFFFF` |
| Texto | `#171717` |
| Texto secundário | `#62525A` |
| Bordas | `#E7DFD3` |
| Fonte | Poppins, se disponível; caso contrário, uma sans-serif equivalente |
| Botões e cartões | Cantos arredondados, conforme os controles disponíveis |

Use o logo com proporção preservada, contraste legível e espaçamento generoso.
Confira pedidos e perfil em celular e desktop antes de salvar/publicar.
As configurações de marca podem também afetar o checkout: revise ambas as áreas.

## Limites da referência

O HTML é uma proposta visual, não um template Liquid instalável na Shopify.
O cabeçalho vinho, a composição dos cartões, o estado vazio e os textos ilustrados
dependem dos recursos oferecidos pelo editor. Não há suporte geral para colar CSS
arbitrário nas novas contas de cliente. Blocos adicionais podem exigir uma
extensão compatível; nem toda mudança de estrutura é permitida pela plataforma.
Não migre para contas legadas apenas para reproduzir a referência.

Nenhuma alteração foi aplicada à loja ou às contas hospedadas por estes arquivos.
