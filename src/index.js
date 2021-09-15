import db from './db.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

app.get ('/produto', async (req, resp) => {
    try {
        let produtos = await db.tb_produto.findAll({
            order: [['id_produto', 'desc']],
        });
        resp.send(produtos);
    } catch (e) {
        resp.send({ erro: e.toString() });
    }
})

app.post ('/produto', async (req, resp) => {
    try {
        let { nome, precoDe, categoria, precoPor, avaliacao, estoque, link, descricao } = req.body;

        let w = req.body;

        let v = await db.tb_produto.findOne({ where: { nm_produto: nome } })
        let produto = await db.tb_produto.findOne({ where: { nm_produto: w.nome } });

        if (v != null)
            return resp.send({ erro: 'Produto já existe!' });

        if (produto != null) 
            return resp.send({ erro: 'Já existe um produto com esse nome' }); 

        if ((precoDe && precoPor && avaliacao && estoque) === NaN)
             return resp.send({ erro: 'Os campos de preços, avaliação e estoque precisam ser preenchidos com números!' });

        if (nome === '' || nome.replace(/\n/g, '') == '')
             return resp.send({ erro: 'O nome do produto é obrigatório!' });
 
        if (precoDe === '')
             return resp.send({ erro: 'O campo do preço de é obrigatório!' });

        if (precoPor === '')
             return resp.send({ erro: 'O campo do preço por é obrigatório!' });
 
        if (categoria === '' || categoria.replace(/\n/g, '') == '')
             return resp.send({ erro: 'O campo da categoria é obrigatório!' });

        if (avaliacao === '' )
             return resp.send({ erro: 'O campo da avaliação é obrigatório!' });
 
        if (estoque === '' )
             return resp.send({ erro: 'O campo do estoque é obrigatório!' });

        if (descricao === '' || descricao.replace(/\n/g, '') == '')
             return resp.send({ erro: 'A descrição do produto é obrigatória!' });
 
        if (link === '' || link.replace(/\n/g, '') == '')
             return resp.send({ erro: 'O link da imagem é obrigatório!' });

        let r = await db.tb_produto.create({
            nm_produto: nome,
            ds_categoria: categoria,
            vl_preco_de: precoDe,
            vl_preco_por: precoPor,
            vl_avaliacao: avaliacao,
            ds_produto: descricao,
            qtd_estoque: estoque,
            img_produto: link,
            dt_inclusao: new Date() 
        })
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() });
    }
})

app.put ('/produto/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let { nome, precoDe, categoria, precoPor, avaliacao, estoque, link, descricao } = req.body;      

        let r = await db.tb_produto.update(
            { 
                nm_produto: nome,
                ds_categoria: categoria,
                vl_preco_de: precoDe,
                vl_preco_por: precoPor,
                vl_avaliacao: avaliacao,
                ds_produto: descricao,
                qtd_estoque: estoque,
                img_produto: link,
                dt_inclusao: new Date() 
            },
            { where: { id_produto: id }})

            resp.sendStatus(200)
    } catch (e) {
        resp.send({ erro: e.toString() });
    }
}) 

app.delete('/produto/:id', async (req, resp) => {
    try {
        let r = await db.tb_produto.destroy({ where: { id_produto: req.params.id } });
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() });
    }
})

app.listen(process.env.PORT,
           x => console.log(`>> Server up at port ${process.env.PORT}`))