const fs = require('fs');

const normalizeText = (text) => {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "") // Remove acentos
        .replace(/[^a-z0-9 ]/g, "") // Remove caracteres especiais
        .replace(/\s+/g, " ") // Remove espaços extras
        .trim();
};

const categorizeProducts = (products) => {
    let categories = {};

    products.forEach(product => {
        const normalizedTitle = normalizeText(product.title);
        const tokens = normalizedTitle.split(" ").sort();
        const categoryKey = tokens.join(" ");
        
        if (!categories[categoryKey]) {
            categories[categoryKey] = {
                category: product.title,
                count: 0,
                products: []
            };
        }

        categories[categoryKey].products.push({
            title: product.title,
            supermarket: product.supermarket
        });
        categories[categoryKey].count++;
    });

    return Object.values(categories);
};

// Ler o arquivo JSON e processar os dados
fs.readFile('./data/data01.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Erro ao ler o arquivo:", err);
        return;
    }
    const products = JSON.parse(data);
    const categorizedProducts = categorizeProducts(products);
    
    fs.writeFile('./data/categorized_products.json', JSON.stringify(categorizedProducts, null, 2), (err) => {
        if (err) {
            console.error("Erro ao salvar o arquivo:", err);
            return;
        }
        console.log("Arquivo categorizado salvo com sucesso em ./data/categorized_products.json");
    });
});
