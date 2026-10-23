# Videira Vinhoteca — Shopify 2.0

Migração do layout de `Guilhsxzd12/VideiraVinhotecaBR` para um tema Liquid nativo da Shopify. Reutiliza a sequência original dos estilos do site, o logo original, a mesma fotografia do banner, os cards compactos, o cabeçalho flutuante, a composição editorial, a página de vinho e o rodapé. Fontes, logo e fotografia padrão são ativos do tema servidos pela Shopify.

## Compra integrada

Produtos, variantes, preços, imagens e disponibilidade vêm da Shopify. A adição usa a Ajax Cart API, com formulários nativos como alternativa quando JavaScript está desabilitado. O carrinho lateral e a página de carrinho exibem itens e descontos retornados pela Shopify. Alterar quantidades, remover e finalizar usa as rotas nativas da loja. Erros de estoque são exibidos sem informar sucesso indevidamente. Nenhum pedido é enviado pelo WhatsApp e nenhum carrinho fica no localStorage; o WhatsApp do rodapé é apenas atendimento.

## Prévia e configuração

1. Em Loja virtual → Temas → Adicionar tema → Conectar GitHub, selecione este repositório e a branch da migração para criar uma prévia. Também é possível enviar o ZIP do tema.
2. Confira a página inicial, catálogo, busca, produto e carrinho na prévia em celular e desktop. Faça um pedido de teste conforme os meios de pagamento configurados na loja antes de publicar.
3. No editor de tema, escolha a coleção da Seleção e dos carrosséis. Novidades usa a opção Mais recentes primeiro; é possível escolher uma coleção específica. Sem seleção, os carrosséis usam o catálogo disponível (`collections.all`).
4. Os tipos e as bodegas são derivados de tipos de produto e fornecedores cadastrados na Shopify. O menu configurável do cabeçalho aceita links adicionais. As origens podem usar blocos com coleções específicas. Sem blocos, países e uvas são extraídos dos primeiros 50 produtos disponíveis; os links de descoberta usam busca. Para catálogos maiores ou filtragem estrita, configure coleções por país/uva e filtros no Shopify Search & Discovery.
5. No Shopify Search & Discovery, habilite os filtros desejados. Filtros, contagens, preços e ordenação usam os parâmetros nativos de coleção. Configure políticas no Admin Shopify para que os links oficiais apareçam no rodapé.
6. O logo original já está incorporado. É possível substituí-lo em Configurações do tema → Videira — Identidade. A foto do banner também pode ser substituída no editor.

## Dados dos vinhos

A ficha técnica lê metacampos opcionais de produto no namespace `custom`: `country`, `region`, `grape`, `vintage`, `volume`, `alcohol`, `aging`, `serving_temperature`, `visual`, `aromas`, `palate`, `tasting_notes`, `pairing`. Crie definições e preencha os campos desejados no Admin Shopify. A descrição principal usa a descrição de produto da Shopify.

O código React/Next.js, o painel administrativo e o banco do site antigo foram substituídos por Liquid e pelo Admin Shopify. Este tema não importa o catálogo ou os cadastros do banco antigo. Também não cria rotas antigas como `/loja` ou os antigos slugs: configure redirecionamentos no Admin Shopify se essas URLs já estiverem indexadas ou divulgadas. Os links do tema já usam as rotas Shopify.

## Validação

- Theme Check: Liquid, schemas, templates, snippets e traduções.
- JavaScript: `node --check assets/videira.js`.
- Testes de navegador em 390 e 1440 pixels com renderização Liquid local e dados Shopify simulados: página inicial, menu mobile, filtros, seleção de variantes, variante sem estoque, zoom, quantidade, resposta de adição ao carrinho e formulário nativo de checkout. Sem overflow horizontal ou erros de JavaScript nos cenários testados.
- O teste local não valida o checkout hospedado, meios de pagamento, frete ou a renderização final nos servidores Shopify. Essa etapa requer a prévia do tema na loja e um pedido de teste.

Os arquivos de captura, o renderizador local e os dados simulados ficam fora do tema. A migração deve ser revisada na prévia antes de mesclar na branch conectada à loja.
