const newman = require('newman');

newman.run({
    collection: require('./collection.json'), // Caminho para sua Collection
    environment: require('./environment.json'), // (Opcional) Caminho para o ambiente
    reporters: ['cli', 'html'], // Relatórios em CLI e HTML
    reporter: { html: { export: './report.html' } } // Salva relatório em HTML
}, function (err) {
    if (err) { throw err; }
    console.log('Testes concluídos!');
});
