from pathlib import Path
from PIL import Image, ImageDraw

SIZE = 1024
BACKGROUND = "#0F1416"
IVORY = "#E8E2D6"
CYAN = "#5EC4E6"
OUTPUT = Path("/home/ubuntu/webdev-static-assets/alpha-line-archive-gate-pfp-final.png")

image = Image.new("RGBA", (SIZE, SIZE), BACKGROUND)
draw = ImageDraw.Draw(image)

# Boundary lines echo the archive index; they frame rather than compete with the mark.
draw.line((112, 142, 112, 882), fill="#1C4E5B", width=8)
draw.line((912, 142, 912, 882), fill="#1C4E5B", width=8)

# Gate leaves: an open book / doorway, not an alphabetic form.
left_leaf = [(242, 318), (468, 414), (468, 701), (322, 790), (322, 512), (242, 478)]
right_leaf = [(782, 318), (556, 414), (556, 701), (702, 790), (702, 512), (782, 478)]
draw.polygon(left_leaf, fill=IVORY)
draw.polygon(right_leaf, fill=IVORY)

# Center spine and three language paths.
draw.line((512, 414, 512, 690), fill=IVORY, width=34)
draw.line((324, 768, 218, 874, 112, 874), fill=IVORY, width=38, joint="curve")
draw.line((512, 702, 512, 830, 408, 920), fill=CYAN, width=38, joint="curve")
draw.line((700, 768, 806, 874, 912, 874), fill=IVORY, width=38, joint="curve")

# Waypoint beacon; the diamond gives the symbol its memorable axis.
draw.line((512, 176, 512, 242), fill=IVORY, width=24)
draw.polygon([(512, 258), (558, 304), (512, 350), (466, 304)], fill=CYAN)
draw.line((512, 368, 512, 400), fill=IVORY, width=24)

# Output has no textual elements; it is safe for avatar crops on every social platform.
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT, "PNG", optimize=True)
print(OUTPUT)
