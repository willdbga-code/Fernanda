import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter

def clean_watermarks(img, filename):
    """Clean up small UI screenshot badges/icons from original references."""
    w, h = img.size
    draw = ImageDraw.Draw(img)
    
    if filename == "studio_ref_04.jpeg":
        # Mute icon in bottom-right corner
        sample_color = img.getpixel((w - 75, h - 25))
        draw.rectangle([(w - 65, h - 65), (w, h)], fill=sample_color)
        
    elif filename == "studio_ref_05.jpeg":
        # 'O / O' badge in top-right corner
        sample_color = img.getpixel((w - 110, 65))
        draw.rectangle([(w - 95, 40), (w, 90)], fill=sample_color)
        
    elif filename == "studio_ref_07.jpeg":
        # '1/6' badge in top-right corner
        sample_color = img.getpixel((w - 110, 50))
        draw.rectangle([(w - 85, 25), (w, 75)], fill=sample_color)
        # small white dot at bottom-left (y around 890..915)
        sample_bl = img.getpixel((60, h - 30))
        draw.rectangle([(0, h - 90), (45, h)], fill=sample_bl)

    elif filename == "studio_ref_08.jpeg":
        # circular mark at bottom-right on pure white backdrop
        draw.rectangle([(w - 70, h - 70), (w, h)], fill=(255, 255, 255))
        
    return img

def create_editorial_collage():
    studio_dir = r"c:\Users\LENOVO\Desktop\Fernanda\Studio"
    output_dir = studio_dir
    assets_dir = r"c:\Users\LENOVO\Desktop\Fernanda\assets"
    
    # Palette
    BG_DARK = (10, 11, 14)           # #0A0B0E deep charcoal noir
    SURFACE_CARD = (17, 18, 23)      # #111217 card surface
    BORDER_SUBTLE = (40, 42, 52)     # #282A34 fine border
    GOLD_ACCENT = (212, 175, 55)     # #D4AF37 luxury gold
    GOLD_MUTED = (197, 168, 128)     # #C5A880 warm gold
    TEXT_LIGHT = (245, 242, 235)     # #F5F2EB ivory
    TEXT_MUTED = (165, 163, 175)     # #A5A3AF soft gray
    TEXT_DIM = (110, 108, 120)       # #6E6C78 dim gray
    
    # Load fonts
    font_path_serif = r"C:\Windows\Fonts\georgiab.ttf"
    font_path_sans = r"C:\Windows\Fonts\segoeui.ttf"
    font_path_sans_bold = r"C:\Windows\Fonts\segoeuib.ttf"
    font_path_sans_light = r"C:\Windows\Fonts\segoeuil.ttf"

    font_eyebrow = ImageFont.truetype(font_path_sans_bold, 22)
    font_title = ImageFont.truetype(font_path_serif, 66)
    font_subtitle = ImageFont.truetype(font_path_sans_light, 26)
    font_badge = ImageFont.truetype(font_path_sans_bold, 18)
    font_card_num = ImageFont.truetype(font_path_sans_bold, 16)
    font_card_title = ImageFont.truetype(font_path_sans_bold, 20)
    font_card_tech = ImageFont.truetype(font_path_sans, 15)
    font_footer = ImageFont.truetype(font_path_sans, 18)
    font_footer_bold = ImageFont.truetype(font_path_sans_bold, 18)

    # 10 Reference Photos & Metadata in Curated Aesthetic Order
    photos_meta = [
        # HERO KEY VISUALS (Row 1)
        {
            "file": "studio_ref_03.jpeg",
            "num": "REF 01 · HERO KEY VISUAL",
            "title": "A Escultura da Silhueta Noir",
            "tech": "50mm f/2.5 · Octabox 90cm c/ Grid a 45° · Contraste Intimista",
            "mood": "Chiaroscuro & Sombra",
            "crop_bias": (0.5, 0.40)
        },
        {
            "file": "studio_ref_06.jpeg",
            "num": "REF 02 · HERO KEY VISUAL",
            "title": "Casual Chic: Jeans & Camiseta Branca",
            "tech": "50mm f/2.0 · Luz Suave Preto & Branco · Estilo Contemporâneo",
            "mood": "Minimalista Urbano",
            "crop_bias": (0.5, 0.42)
        },
        # ROW 2: CORE STUDIO POSES
        {
            "file": "studio_ref_04.jpeg",
            "num": "REF 03",
            "title": "Abraço Protetor Monocromático",
            "tech": "50mm f/2.8 · Luz Direcional c/ Colmeia",
            "mood": "Cumplicidade",
            "crop_bias": (0.5, 0.38)
        },
        {
            "file": "studio_ref_05.jpeg",
            "num": "REF 04",
            "title": "Toque Afetivo & Sorrisos",
            "tech": "50mm f/2.2 · Softbox Difuso + Fundo Escuro",
            "mood": "Espontaneidade",
            "crop_bias": (0.5, 0.42)
        },
        {
            "file": "studio_ref_07.jpeg",
            "num": "REF 05",
            "title": "O Manto de Sombra & Silhueta",
            "tech": "50mm f/2.8 · Stripbox Lateral + V-Flat",
            "mood": "Contorno Escultural",
            "crop_bias": (0.5, 0.40)
        },
        {
            "file": "studio_ref_08.jpeg",
            "num": "REF 06",
            "title": "Alianças & O Toque Sagrado",
            "tech": "50mm Macro f/2.8 · Luz Pontual Suave",
            "mood": "Detalhe Intimista",
            "crop_bias": (0.5, 0.42)
        },
        # ROW 3: EDITORIAL & MOOD REFERENCES
        {
            "file": "studio_ref_09.jpeg",
            "num": "REF 07",
            "title": "Retrato Editorial de Casal",
            "tech": "50mm f/2.5 · Rim Light Traseiro + V-Flat",
            "mood": "Editorial Glamour",
            "crop_bias": (0.5, 0.35)
        },
        {
            "file": "studio_ref_10.jpeg",
            "num": "REF 08",
            "title": "A Serenidade Materna",
            "tech": "50mm f/2.2 · Luz de Janela Simulada",
            "mood": "Sensibilidade",
            "crop_bias": (0.5, 0.42)
        },
        {
            "file": "studio_ref_02.jpeg",
            "num": "REF 09",
            "title": "Conexão Espontânea & Movimento",
            "tech": "50mm f/2.8 · Dinâmica de Casal & Emoção",
            "mood": "Conexão Real",
            "crop_bias": (0.5, 0.42)
        },
        {
            "file": "studio_ref_01.jpeg",
            "num": "REF 10",
            "title": "Fluidez & Luz de Transição",
            "tech": "50mm f/2.5 · Luz Suave & Tecido Esvoaçante",
            "mood": "Luz & Fluidez",
            "crop_bias": (0.5, 0.42)
        }
    ]

    # Canvas Dimensions for Vertical Editorial Poster
    CANVAS_W = 2800
    CANVAS_H = 3900
    MARGIN_X = 80
    HEADER_H = 380
    FOOTER_H = 140
    GAP = 36

    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BG_DARK)
    draw = ImageDraw.Draw(canvas)

    # Background subtle radial/vertical vignette
    for y in range(CANVAS_H):
        ratio = y / CANVAS_H
        factor = 1.0 - 0.22 * math.sin(ratio * math.pi)
        r = int(BG_DARK[0] * factor + 3 * (1 - factor))
        g = int(BG_DARK[1] * factor + 4 * (1 - factor))
        b = int(BG_DARK[2] * factor + 6 * (1 - factor))
        draw.line([(0, y), (CANVAS_W, y)], fill=(r, g, b))

    # Outer decorative fine frame
    frame_margin = 32
    draw.rectangle(
        [(frame_margin, frame_margin), (CANVAS_W - frame_margin, CANVAS_H - frame_margin)],
        outline=(30, 32, 40),
        width=1
    )
    # Corner gold accents
    corner_len = 45
    corners = [
        (frame_margin, frame_margin, 1, 1),
        (CANVAS_W - frame_margin, frame_margin, -1, 1),
        (frame_margin, CANVAS_H - frame_margin, 1, -1),
        (CANVAS_W - frame_margin, CANVAS_H - frame_margin, -1, -1)
    ]
    for cx, cy, dx, dy in corners:
        draw.line([(cx, cy), (cx + dx * corner_len, cy)], fill=GOLD_ACCENT, width=2)
        draw.line([(cx, cy), (cx, cy + dy * corner_len)], fill=GOLD_ACCENT, width=2)

    # ==========================================
    # HEADER SECTION
    # ==========================================
    header_top = 80
    
    # Eyebrow tag
    draw.text((MARGIN_X, header_top), "DIREÇÃO VISUAL & ILUMINAÇÃO DE ESTÚDIO · MOODBOARD EXECUTIVO", fill=GOLD_MUTED, font=font_eyebrow)
    
    # Right-aligned session meta
    right_meta = "ENSAIO GESTANTE · 13H00 ÀS 16H00 · PINDAMONHANGABA"
    bbox_rm = font_eyebrow.getbbox(right_meta)
    draw.text((CANVAS_W - MARGIN_X - (bbox_rm[2] - bbox_rm[0]), header_top), right_meta, fill=TEXT_MUTED, font=font_eyebrow)

    # Thin separator line
    draw.line([(MARGIN_X, header_top + 45), (CANVAS_W - MARGIN_X, header_top + 45)], fill=(40, 42, 52), width=1)
    draw.line([(MARGIN_X, header_top + 45), (MARGIN_X + 240, header_top + 45)], fill=GOLD_ACCENT, width=2)

    # Main Title
    title_top = header_top + 65
    draw.text((MARGIN_X, title_top), "FERNANDA & JOÃO", fill=TEXT_LIGHT, font=font_title)
    
    # Subtitle
    sub_top = title_top + 85
    draw.text((MARGIN_X, sub_top), "ATMOSFERA 02: STUDIO NOIR & INTIMIDADE MONOCROMÁTICA", fill=TEXT_MUTED, font=font_subtitle)

    # Technical Specs Badges (Pills)
    badges = [
        "LENTE: 50MM PRIME (f/1.8 - f/2.8)",
        "LUZ: OCTABOX 90CM C/ GRID",
        "PREENCHIMENTO: REBATEDOR & V-FLATS NEGROS",
        "ESTÉTICA: CHIAROSCURO & LOW-KEY"
    ]
    badge_x = MARGIN_X
    badge_y = sub_top + 55
    for b_text in badges:
        b_bbox = font_badge.getbbox(b_text)
        b_w = (b_bbox[2] - b_bbox[0]) + 30
        b_h = 36
        draw.rounded_rectangle([(badge_x, badge_y), (badge_x + b_w, badge_y + b_h)], radius=6, fill=(22, 23, 30), outline=(52, 55, 68), width=1)
        draw.text((badge_x + 15, badge_y + 8), b_text, fill=TEXT_LIGHT, font=font_badge)
        badge_x += b_w + 16

    # ==========================================
    # PHOTO GRID COMPOSITION (2 + 4 + 4 = 10)
    # ==========================================
    grid_top = header_top + HEADER_H
    avail_w = CANVAS_W - 2 * MARGIN_X
    
    # ROW 1: 2 HERO KEY VISUALS (50% width each)
    r1_cols = 2
    r1_w = (avail_w - GAP) // r1_cols
    r1_h = 1040
    r1_caption_h = 75
    
    # ROW 2: 4 PHOTOS (25% width each)
    r2_cols = 4
    r2_w = (avail_w - 3 * GAP) // r2_cols
    r2_h = 760
    r2_caption_h = 75

    # ROW 3: 4 PHOTOS (25% width each)
    r3_cols = 4
    r3_w = r2_w
    r3_h = 760
    r3_caption_h = 75

    # Helper function to place photo card
    def place_card(idx, x, y, w, h, cap_h, is_hero=False):
        meta = photos_meta[idx]
        img_path = os.path.join(studio_dir, meta["file"])
        
        # Outer Card Background with subtle border
        card_box = [(x, y), (x + w, y + h + cap_h)]
        draw.rounded_rectangle(card_box, radius=12, fill=SURFACE_CARD, outline=BORDER_SUBTLE, width=1)
        
        # Load and fit image
        if os.path.exists(img_path):
            with Image.open(img_path) as raw_img:
                raw_rgb = raw_img.convert("RGB")
                # Clean watermarks/badges if any
                raw_cleaned = clean_watermarks(raw_rgb, meta["file"])
                # Custom crop bias
                crop_center = meta.get("crop_bias", (0.5, 0.42))
                fitted = ImageOps.fit(raw_cleaned, (w, h), centering=crop_center)
                
                # Create mask with rounded top corners
                mask = Image.new("L", (w, h), 0)
                mask_draw = ImageDraw.Draw(mask)
                mask_draw.rounded_rectangle([(0, 0), (w, h + 24)], radius=12, fill=255)
                
                canvas.paste(fitted, (x, y), mask)
                
                # Image inner fine border
                draw.rounded_rectangle([(x, y), (x + w, y + h)], radius=12, outline=(55, 58, 70), width=1)
        
        # Tag Badge over image top-left
        badge_text = meta["num"]
        num_bbox = font_card_num.getbbox(badge_text)
        num_w = (num_bbox[2] - num_bbox[0]) + 22
        num_h = 28
        tag_bg = GOLD_ACCENT if is_hero else (20, 21, 28)
        tag_text_color = (10, 11, 14) if is_hero else GOLD_MUTED
        draw.rounded_rectangle([(x + 14, y + 14), (x + 14 + num_w, y + 14 + num_h)], radius=4, fill=tag_bg, outline=(0, 0, 0), width=1)
        draw.text((x + 25, y + 19), badge_text, fill=tag_text_color, font=font_card_num)
        
        # Mood Tag over image top-right
        mood_text = meta["mood"].upper()
        mood_bbox = font_card_num.getbbox(mood_text)
        mood_w = (mood_bbox[2] - mood_bbox[0]) + 20
        draw.rounded_rectangle([(x + w - 14 - mood_w, y + 14), (x + w - 14, y + 14 + num_h)], radius=4, fill=(12, 13, 17), outline=(50, 53, 65), width=1)
        draw.text((x + w - mood_w - 4, y + 19), mood_text, fill=TEXT_LIGHT, font=font_card_num)

        # Caption area below image
        cap_y = y + h + 14
        draw.text((x + 18, cap_y), meta["title"], fill=TEXT_LIGHT, font=font_card_title)
        draw.text((x + 18, cap_y + 28), meta["tech"], fill=TEXT_MUTED, font=font_card_tech)

    # Place Row 1 (Heroes: idx 0 and 1)
    cur_y = grid_top
    for i in range(2):
        cur_x = MARGIN_X + i * (r1_w + GAP)
        place_card(i, cur_x, cur_y, r1_w, r1_h, r1_caption_h, is_hero=True)
    
    cur_y += r1_h + r1_caption_h + GAP

    # Place Row 2 (Photos: idx 2, 3, 4, 5)
    for i in range(4):
        idx = 2 + i
        cur_x = MARGIN_X + i * (r2_w + GAP)
        place_card(idx, cur_x, cur_y, r2_w, r2_h, r2_caption_h, is_hero=False)

    cur_y += r2_h + r2_caption_h + GAP

    # Place Row 3 (Photos: idx 6, 7, 8, 9)
    for i in range(4):
        idx = 6 + i
        cur_x = MARGIN_X + i * (r3_w + GAP)
        place_card(idx, cur_x, cur_y, r3_w, r3_h, r3_caption_h, is_hero=False)

    # ==========================================
    # FOOTER SECTION
    # ==========================================
    footer_y = CANVAS_H - FOOTER_H
    draw.line([(MARGIN_X, footer_y), (CANVAS_W - MARGIN_X, footer_y)], fill=(35, 37, 45), width=1)

    # Left footer note
    draw.text((MARGIN_X, footer_y + 35), "DIRETRIZES TÉCNICAS:", fill=GOLD_MUTED, font=font_footer_bold)
    draw.text((MARGIN_X + 220, footer_y + 35), "Priorizar profundidade de campo f/2.0 a f/2.8 para isolamento suave. Rebatedor a 45° oposto ao flash para transição sedosa de luz.", fill=TEXT_MUTED, font=font_footer)

    # Right footer attribution
    foot_right = "PRODUÇÃO EXECUTIVA · @ROLEDOCASAL · STUDIO NOIR"
    f_bbox = font_footer_bold.getbbox(foot_right)
    draw.text((CANVAS_W - MARGIN_X - (f_bbox[2] - f_bbox[0]), footer_y + 35), foot_right, fill=TEXT_LIGHT, font=font_footer_bold)

    # Save Vertical Editorial Collage
    out_vertical = os.path.join(output_dir, "colagem_studio_editorial.jpg")
    out_main = os.path.join(output_dir, "colagem_studio.jpg")
    out_assets = os.path.join(assets_dir, "colagem_studio.jpg")
    
    canvas.save(out_vertical, "JPEG", quality=95, optimize=True)
    canvas.save(out_main, "JPEG", quality=95, optimize=True)
    canvas.save(out_assets, "JPEG", quality=95, optimize=True)
    print(f"Saved refined vertical editorial collage to: {out_main} ({CANVAS_W}x{CANVAS_H})")

    # ==========================================
    # WIDESCREEN / HORIZONTAL PRESENTATION BOARD
    # 5 COLUMNS x 2 ROWS (3600 x 2200 px)
    # ==========================================
    HORIZ_W = 3600
    HORIZ_H = 2200
    h_canvas = Image.new("RGB", (HORIZ_W, HORIZ_H), BG_DARK)
    h_draw = ImageDraw.Draw(h_canvas)

    # Subtle gradient
    for y in range(HORIZ_H):
        ratio = y / HORIZ_H
        factor = 1.0 - 0.22 * math.sin(ratio * math.pi)
        r = int(BG_DARK[0] * factor + 3 * (1 - factor))
        g = int(BG_DARK[1] * factor + 4 * (1 - factor))
        b = int(BG_DARK[2] * factor + 6 * (1 - factor))
        h_draw.line([(0, y), (HORIZ_W, y)], fill=(r, g, b))

    # Outer decorative frame
    h_draw.rectangle([(frame_margin, frame_margin), (HORIZ_W - frame_margin, HORIZ_H - frame_margin)], outline=(30, 32, 40), width=1)
    for cx, cy, dx, dy in [
        (frame_margin, frame_margin, 1, 1),
        (HORIZ_W - frame_margin, frame_margin, -1, 1),
        (frame_margin, HORIZ_H - frame_margin, 1, -1),
        (HORIZ_W - frame_margin, HORIZ_H - frame_margin, -1, -1)
    ]:
        h_draw.line([(cx, cy), (cx + dx * corner_len, cy)], fill=GOLD_ACCENT, width=2)
        h_draw.line([(cx, cy), (cx, cy + dy * corner_len)], fill=GOLD_ACCENT, width=2)

    # Horizontal Header
    h_header_top = 70
    h_draw.text((MARGIN_X, h_header_top), "MOODBOARD DE DIREÇÃO VISUAL & ILUMINAÇÃO · PAINEL GERAL DE ESTÚDIO", fill=GOLD_MUTED, font=font_eyebrow)
    
    h_right = "ENSAIO GESTANTE · FERNANDA & JOÃO · 13H00 ÀS 16H00"
    hr_bbox = font_eyebrow.getbbox(h_right)
    h_draw.text((HORIZ_W - MARGIN_X - (hr_bbox[2] - hr_bbox[0]), h_header_top), h_right, fill=TEXT_MUTED, font=font_eyebrow)

    h_draw.line([(MARGIN_X, h_header_top + 40), (HORIZ_W - MARGIN_X, h_header_top + 40)], fill=(40, 42, 52), width=1)
    h_draw.line([(MARGIN_X, h_header_top + 40), (MARGIN_X + 240, h_header_top + 40)], fill=GOLD_ACCENT, width=2)

    h_title_top = h_header_top + 55
    h_draw.text((MARGIN_X, h_title_top), "FERNANDA & JOÃO · STUDIO NOIR", fill=TEXT_LIGHT, font=font_title)
    h_draw.text((MARGIN_X, h_title_top + 75), "Composição de 10 Referências Oficiais de Estúdio · 50mm Prime · Octabox 90cm c/ Colmeia · Chiaroscuro", fill=TEXT_MUTED, font=font_subtitle)

    # 5 Cols x 2 Rows
    h_cols = 5
    h_rows = 2
    h_avail_w = HORIZ_W - 2 * MARGIN_X
    h_card_w = (h_avail_w - (h_cols - 1) * GAP) // h_cols
    h_card_h = 700
    h_cap_h = 65
    h_grid_top = h_title_top + 130

    for idx, meta in enumerate(photos_meta):
        col = idx % h_cols
        row = idx // h_cols
        x = MARGIN_X + col * (h_card_w + GAP)
        y = h_grid_top + row * (h_card_h + h_cap_h + GAP)

        # Card container
        h_draw.rounded_rectangle([(x, y), (x + h_card_w, y + h_card_h + h_cap_h)], radius=10, fill=SURFACE_CARD, outline=BORDER_SUBTLE, width=1)

        img_path = os.path.join(studio_dir, meta["file"])
        if os.path.exists(img_path):
            with Image.open(img_path) as raw_img:
                raw_rgb = raw_img.convert("RGB")
                raw_cleaned = clean_watermarks(raw_rgb, meta["file"])
                crop_center = meta.get("crop_bias", (0.5, 0.42))
                fitted = ImageOps.fit(raw_cleaned, (h_card_w, h_card_h), centering=crop_center)
                
                mask = Image.new("L", (h_card_w, h_card_h), 0)
                mask_draw = ImageDraw.Draw(mask)
                mask_draw.rounded_rectangle([(0, 0), (h_card_w, h_card_h + 20)], radius=10, fill=255)
                h_canvas.paste(fitted, (x, y), mask)
                h_draw.rounded_rectangle([(x, y), (x + h_card_w, y + h_card_h)], radius=10, outline=(55, 58, 70), width=1)

        # Number Tag
        ref_label = f"REF {idx + 1:02d}"
        n_bbox = font_card_num.getbbox(ref_label)
        n_w = (n_bbox[2] - n_bbox[0]) + 16
        h_draw.rounded_rectangle([(x + 10, y + 10), (x + 10 + n_w, y + 34)], radius=4, fill=(12, 13, 18), outline=GOLD_MUTED, width=1)
        h_draw.text((x + 18, y + 14), ref_label, fill=GOLD_MUTED, font=font_card_num)

        # Caption
        cap_y = y + h_card_h + 10
        h_draw.text((x + 12, cap_y), meta["title"][:28] + ("..." if len(meta["title"]) > 28 else ""), fill=TEXT_LIGHT, font=font_card_title)
        h_draw.text((x + 12, cap_y + 25), meta["tech"][:38] + ("..." if len(meta["tech"]) > 38 else ""), fill=TEXT_MUTED, font=font_card_tech)

    # Footer
    h_footer_y = HORIZ_H - 80
    h_draw.line([(MARGIN_X, h_footer_y), (HORIZ_W - MARGIN_X, h_footer_y)], fill=(35, 37, 45), width=1)
    h_draw.text((MARGIN_X, h_footer_y + 25), "ESQUEMA DE ILUMINAÇÃO: Octabox 90cm c/ Grid como Luz Principal a 45° · Stripbox c/ Grid para Luz de Recorte Lateral · V-Flats Pretos para Controle de Contraste", fill=TEXT_MUTED, font=font_footer)
    h_draw.text((HORIZ_W - MARGIN_X - 420, h_footer_y + 25), "DIREÇÃO DE FOTOGRAFIA · @ROLEDOCASAL", fill=GOLD_MUTED, font=font_footer_bold)

    out_horiz = os.path.join(output_dir, "colagem_studio_horizontal.jpg")
    out_assets_h = os.path.join(assets_dir, "colagem_studio_horizontal.jpg")
    h_canvas.save(out_horiz, "JPEG", quality=95, optimize=True)
    h_canvas.save(out_assets_h, "JPEG", quality=95, optimize=True)
    print(f"Saved refined horizontal collage to: {out_horiz} ({HORIZ_W}x{HORIZ_H})")

if __name__ == "__main__":
    create_editorial_collage()
