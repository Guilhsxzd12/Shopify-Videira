# Regressões do tema

Execute `npm ci`, `npx playwright install chromium` e `npm test` nesta pasta.

Os testes renderizam os arquivos reais do tema com LiquidJS e dados Shopify simulados. Cobrem catálogos com zero, um e seis produtos, com e sem metacampos, em 390 e 1440 px. Verificam JSON-LD válido sem texto técnico visível, seções condicionais, carrosséis e overflow, variantes indisponíveis e adição com quantidade ao carrinho. Capturas são gravadas em `artifacts/` e não entram no Git.

O filtro `structured_data` da simulação retorna JSON puro, como na Shopify. O tema é responsável por envolvê-lo em um script `application/ld+json`. Essa diferença é essencial para que o teste detecte a regressão de JSON visível.

A simulação não substitui a conferência do HTML servido pela Shopify. Formulários e paginação usam adaptadores locais, e os endpoints de carrinho retornam dados simulados; nenhum pedido ou pagamento real é realizado.
