import copy
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

def build():
    src_path = '/Users/lourivalcavalcante/Downloads/Orange Gradient Portfolio Design Presentation.pptx'
    prs = Presentation(src_path)

    # Identificar os 4 primeiros slides intactos
    s1 = prs.slides[0]
    s2 = prs.slides[1]
    s3 = prs.slides[2]
    s4 = prs.slides[3]
    s5 = prs.slides[4]
    s6 = prs.slides[5]

    # Reutilizaremos s5 e s6 ao invés de apagá-los, e depois adicionaremos os demais
    # Isso evita nomes de arquivos duplicados no zipfile interno do OpenXML!
    
    template_slide = s3
    bg_shape = template_slide.shapes[0]
    decor_shape = template_slide.shapes[3]
    blank_layout = template_slide.slide_layout

    TITLE_LEFT = 2966848
    TITLE_TOP = 1100000
    TITLE_WIDTH = 13530452
    TITLE_HEIGHT = 1000000

    BODY_LEFT = 3200000
    BODY_TOP = 2400000
    BODY_WIDTH = 12500000
    BODY_HEIGHT = 6500000

    new_slides_data = [
        {
            "title": "O que um QA faz?",
            "paragraphs": [
                ("A evolução do papel de Qualidade no ciclo de vida de software:", True, 28, RGBColor(20, 20, 20)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("• Da verificação manual à Engenharia de Qualidade (QE).", False, 26, RGBColor(40, 40, 40)),
                ("• Garantia de requisitos funcionais, performance, usabilidade e segurança.", False, 26, RGBColor(40, 40, 40)),
                ("• 'Shift-Left Testing': Testar antes, pensar na segurança desde a concepção da API.", False, 26, RGBColor(40, 40, 40)),
                ("• O QA moderno não procura apenas falhas na tela: ele valida contratos de APIs, autorizações e regras de negócio no backend.", False, 26, RGBColor(40, 40, 40)),
            ]
        },
        {
            "title": "Teste de Segurança",
            "paragraphs": [
                ("Por que segurança de APIs é responsabilidade de Qualidade?", True, 28, RGBColor(20, 20, 20)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("• Mais de 80% do tráfego web atual trafega exclusivamente por REST APIs.", False, 26, RGBColor(40, 40, 40)),
                ("• Falhas de autorização geralmente NÃO quebram o sistema (não dão erro 500 nem alerta na tela).", False, 26, RGBColor(40, 40, 40)),
                ("• Se um usuário compra um produto de R$ 15.000 por R$ 1,00, a API responde '200 OK - Pedido Criado com Sucesso!'.", False, 26, RGBColor(40, 40, 40)),
                ("• O papel do QA é testar caminhos de exceção e ataques de abuso de permissão (OWASP API Security Top 10).", False, 26, RGBColor(40, 40, 40)),
            ]
        },
        {
            "title": "Camadas de Teste",
            "paragraphs": [
                ("A Pirâmide e Estratégia de Testes para APIs:", True, 28, RGBColor(20, 20, 20)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("1. Testes Unitários: Validam métodos isolados (ex: função de cálculo de desconto e hash de senha).", False, 25, RGBColor(40, 40, 40)),
                ("2. Testes de Integração / Contrato: Validam middlewares de autenticação, rotas e banco de dados.", False, 25, RGBColor(40, 40, 40)),
                ("3. Testes de Segurança de API (Live Hacking):", True, 25, RGBColor(20, 20, 20)),
                ("   - BFLA (Quebra de função administrativa).", False, 24, RGBColor(50, 50, 50)),
                ("   - BOLA / IDOR (Manipulação de parâmetros de objetos alheios).", False, 24, RGBColor(50, 50, 50)),
                ("   - Price Tampering & Data Integrity (Adulteração de valores e propriedades).", False, 24, RGBColor(50, 50, 50)),
                ("4. Testes End-to-End (E2E): Fluxo completo pelo frontend até o checkout.", False, 25, RGBColor(40, 40, 40)),
            ]
        },
        {
            "title": "Entendendo o Conceito de REST API",
            "paragraphs": [
                ("Arquitetura Cliente-Servidor e o Protocolo HTTP:", True, 28, RGBColor(20, 20, 20)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("• Stateless: Cada requisição HTTP precisa conter todas as credenciais necessárias para autorizar a operação.", False, 26, RGBColor(40, 40, 40)),
                ("• Métodos HTTP padronizados: GET (Leitura), POST (Criação), PUT (Atualização), DELETE (Exclusão).", False, 26, RGBColor(40, 40, 40)),
                ("• Códigos de Status que todo QA deve auditar:", True, 26, RGBColor(20, 20, 20)),
                ("   - 200 OK / 201 Created: Sucesso legítimo.", False, 24, RGBColor(50, 50, 50)),
                ("   - 401 Unauthorized: Usuário não autenticado (falta token ou token inválido).", False, 24, RGBColor(50, 50, 50)),
                ("   - 403 Forbidden: Usuário autenticado, mas NÃO TEM PERMISSÃO para este recurso.", False, 24, RGBColor(50, 50, 50)),
            ]
        },
        {
            "title": "Token: Desmistificando o JWT",
            "paragraphs": [
                ("O que é e o que NÃO é um JSON Web Token?", True, 28, RGBColor(20, 20, 20)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("• MITO DE MERCADO: 'JWT é criptografia' -> FALSO!", True, 26, RGBColor(180, 20, 20)),
                ("• O JWT é composto por 3 partes separadas por ponto: Header . Payload . Signature", False, 26, RGBColor(40, 40, 40)),
                ("  - Header: Algoritmo (HS256) e tipo do token.", False, 24, RGBColor(50, 50, 50)),
                ("  - Payload: Dados do usuário (id, username, role) codificados em Base64URL. Qualquer pessoa consegue ler!", False, 24, RGBColor(50, 50, 50)),
                ("  - Signature: Garante a integridade com uma chave secreta do servidor.", False, 24, RGBColor(50, 50, 50)),
                ("• Perigo real: Se a chave do backend for fraca ('secret123'), o token pode ser forjado para virar ADMIN!", False, 26, RGBColor(40, 40, 40)),
            ]
        },
        {
            "title": "BFLA / BOLA: As Falhas Mais Perigosas",
            "paragraphs": [
                ("Top 10 OWASP API Security na prática:", True, 28, RGBColor(20, 20, 20)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("1. BFLA (Broken Function Level Authorization - OWASP API5:2023):", True, 26, RGBColor(20, 20, 20)),
                ("   - O servidor verifica se o token existe, mas não valida o papel (Role).", False, 24, RGBColor(50, 50, 50)),
                ("   - Exemplo: Alice (cliente comum) chama GET /api/admin/financials e vê o faturamento secreto.", False, 24, RGBColor(50, 50, 50)),
                ("2. BOLA (Broken Object Level Authorization - OWASP API1:2023):", True, 26, RGBColor(20, 20, 20)),
                ("   - Atualização direta por ID na URL sem validar a propriedade do objeto.", False, 24, RGBColor(50, 50, 50)),
                ("   - Exemplo: Maria altera o preço do MacBook de João via PUT /api/products/1/price.", False, 24, RGBColor(50, 50, 50)),
            ]
        },
        {
            "title": "Mão na Massa: Live Demo no Hoppscotch",
            "paragraphs": [
                ("Demonstração ao Vivo no E-commerce TechMarket:", True, 28, RGBColor(20, 20, 20)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("• Como acompanhar no seu celular ou notebook:", True, 26, RGBColor(20, 20, 20)),
                ("  1. Acesse: https://hoppscotch.io", False, 25, RGBColor(40, 40, 40)),
                ("  2. Cole a coleção oficial via Gist:", False, 25, RGBColor(40, 40, 40)),
                ("     https://gist.github.com/cavalcanteJr/07f2097d8fec43894afc9cc806b5a764", True, 24, RGBColor(0, 102, 204)),
                ("  3. Na API V1: Observe a aprovação indevida e a alteração de preço do rival.", False, 25, RGBColor(40, 40, 40)),
                ("  4. Na API V2: Veja a blindagem com 401 Unauthorized e 403 Forbidden!", False, 25, RGBColor(40, 40, 40)),
                ("  5. Encontrou um bug? Reporte pelo botão flutuante para aparecer no telão ao vivo!", False, 25, RGBColor(40, 40, 40)),
            ]
        },
        {
            "title": "Considerações Finais",
            "paragraphs": [
                ("3 Lições Fundamentais para a sua Carreira:", True, 28, RGBColor(20, 20, 20)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("1. Autenticação ≠ Autorização:", True, 26, RGBColor(20, 20, 20)),
                ("   - Autenticação identifica QUEM é o usuário. Autorização define O QUE ele pode fazer.", False, 24, RGBColor(50, 50, 50)),
                ("2. No Banco de Dados, valide a propriedade SEMPRE:", True, 26, RGBColor(20, 20, 20)),
                ("   - Nunca execute queries usando apenas o ID vindo do cliente. Amarre com o usuário logado.", False, 24, RGBColor(50, 50, 50)),
                ("3. Qualidade e Segurança andam juntas:", True, 26, RGBColor(20, 20, 20)),
                ("   - Segurança de API não é assunto só de pentest: começa no design do contrato e nos testes do QA.", False, 24, RGBColor(50, 50, 50)),
                ("", False, 14, RGBColor(0, 0, 0)),
                ("Obrigado a todos! Perguntas & Discussão aberta 🚀", True, 26, RGBColor(200, 70, 0)),
            ]
        }
    ]

    def setup_slide_content(slide, data):
        # Limpar shapes antigos caso reutilizado
        spTree = slide.shapes._spTree
        for child in list(spTree):
            tag = child.tag.split('}')[-1]
            if tag in ['sp', 'grpSp', 'pic']:
                spTree.remove(child)

        # Inserir fundo com image3.png
        new_bg = copy.deepcopy(bg_shape._element)
        blip = new_bg.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
        if blip is not None:
            embed_attr = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed'
            old_rid = blip.attrib[embed_attr]
            target_part = template_slide.part.rels[old_rid].target_part
            new_rid = slide.part.relate_to(target_part, template_slide.part.rels[old_rid].reltype)
            blip.attrib[embed_attr] = new_rid
        slide.shapes._spTree.append(new_bg)

        # Inserir elemento decorativo lateral
        new_decor = copy.deepcopy(decor_shape._element)
        slide.shapes._spTree.append(new_decor)

        # Adicionar Título
        title_box = slide.shapes.add_textbox(TITLE_LEFT, TITLE_TOP, TITLE_WIDTH, TITLE_HEIGHT)
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = data["title"]
        p_title.font.name = "Neue Machina Ultra-Bold"
        p_title.font.size = Pt(64)
        p_title.font.bold = True
        p_title.font.color.rgb = RGBColor(10, 10, 10)

        # Adicionar Corpo de Texto
        body_box = slide.shapes.add_textbox(BODY_LEFT, BODY_TOP, BODY_WIDTH, BODY_HEIGHT)
        tf_body = body_box.text_frame
        tf_body.word_wrap = True

        for idx, (p_text, is_bold, font_size, color) in enumerate(data["paragraphs"]):
            p = tf_body.paragraphs[0] if idx == 0 else tf_body.add_paragraph()
            p.text = p_text
            p.font.name = "Glacial Indifference"
            p.font.size = Pt(font_size)
            p.font.bold = is_bold
            p.font.color.rgb = color

    # Reaproveitar s5 e s6 para os tópicos 1 e 2
    setup_slide_content(s5, new_slides_data[0])
    setup_slide_content(s6, new_slides_data[1])

    # Adicionar os outros 6 slides restantes
    for data in new_slides_data[2:]:
        new_slide = prs.slides.add_slide(blank_layout)
        setup_slide_content(new_slide, data)

    prs.save("presentation/seguranca-rest-apis.pptx")
    prs.save("/Users/lourivalcavalcante/Downloads/Orange Gradient Portfolio Design Presentation.pptx")
    print("Salvo com 100% de integridade nos dois caminhos!")

if __name__ == "__main__":
    build()
