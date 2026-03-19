#!/usr/bin/env python3
"""
Script to generate demo images for SpeakWell website
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os

    # Create images directory
    os.makedirs('frontend/public/images', exist_ok=True)

    # Color palette
    colors = {
        'primary': '#667eea',
        'secondary': '#764ba2',
        'accent': '#ff6b6b',
        'light_bg': '#f5f7fa',
        'dark_text': '#333333'
    }

    def create_gradient_image(width, height, color1, color2, text, filename):
        """Create a gradient image with text"""
        img = Image.new('RGB', (width, height), color=color1)
        draw = ImageDraw.Draw(img)

        # Draw semi-transparent gradient effect
        for y in range(height):
            r = int(int(color1[1:3], 16) * (1 - y/height) + int(color2[1:3], 16) * (y/height))
            g = int(int(color1[3:5], 16) * (1 - y/height) + int(color2[3:5], 16) * (y/height))
            b = int(int(color1[5:7], 16) * (1 - y/height) + int(color2[5:7], 16) * (y/height))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # Draw text
        try:
            font = ImageFont.truetype("arial.ttf", 40)
        except:
            font = ImageFont.load_default()

        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (width - text_width) // 2
        y = (height - text_height) // 2

        draw.text((x, y), text, fill='white', font=font)
        img.save(filename)

    def create_solid_image(width, height, color, text, filename):
        """Create a solid color image with text"""
        img = Image.new('RGB', (width, height), color=color)
        draw = ImageDraw.Draw(img)

        try:
            font = ImageFont.truetype("arial.ttf", 40)
        except:
            font = ImageFont.load_default()

        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (width - text_width) // 2
        y = (height - text_height) // 2

        text_color = 'white' if sum(int(color[i:i+2], 16) for i in (1, 3, 5)) < 384 else 'black'
        draw.text((x, y), text, fill=text_color, font=font)
        img.save(filename)

    # Generate hero image
    create_gradient_image(800, 400, '#667eea', '#764ba2', 'Learn English\nwith Confidence',
                         'frontend/public/images/hero.jpg')

    # Generate instructor image
    create_gradient_image(400, 400, '#764ba2', '#667eea', 'Rajesh Kumar\nTrainer',
                         'frontend/public/images/instructor.jpg')

    # Generate service images
    services = [
        ('service1.jpg', '#4CAF50', 'Beginner\nEnglish'),
        ('service2.jpg', '#2196F3', 'Intermediate\nEnglish'),
        ('service3.jpg', '#FF9800', 'Advanced\nEnglish'),
        ('service4.jpg', '#9C27B0', 'Accent\nReduction'),
        ('service5.jpg', '#F44336', 'IELTS\nPreparation'),
        ('service6.jpg', '#00BCD4', 'Corporate\nTraining'),
    ]

    for filename, color, text in services:
        create_solid_image(400, 250, color, text, f'frontend/public/images/{filename}')

    # Generate testimonial images
    testimonials = [
        ('testimonial1.jpg', '#667eea', 'Priya Singh'),
        ('testimonial2.jpg', '#764ba2', 'Amit Patel'),
        ('testimonial3.jpg', '#ff6b6b', 'Neha Kapoor'),
        ('testimonial4.jpg', '#4CAF50', 'Rahul Sharma'),
        ('testimonial5.jpg', '#FF9800', 'Anjali Desai'),
    ]

    for filename, color, text in testimonials:
        create_solid_image(300, 300, color, text, f'frontend/public/images/{filename}')

    print("[OK] Demo images created successfully!")
    print("[OK] Images stored in: frontend/public/images/")

except ImportError:
    print("[WARN] PIL (Pillow) not found. Installing...")
    import subprocess
    subprocess.run(['pip', 'install', 'Pillow'], check=True)
    print("[OK] Pillow installed. Please run this script again.")
except Exception as e:
    print(f"[ERROR] Error: {e}")
    print("Creating placeholder SVG images instead...")

    os.makedirs('frontend/public/images', exist_ok=True)

    # Create SVG placeholder images
    def create_svg(filename, color, text):
        svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="250" fill="{color}"/>
  <text x="50%" y="50%" font-size="24" font-family="Arial" text-anchor="middle"
    dominant-baseline="middle" fill="white">{text}</text>
</svg>'''
        with open(f'frontend/public/images/{filename}', 'w') as f:
            f.write(svg_content)

    # Create images
    for i in range(1, 7):
        create_svg(f'service{i}.jpg', f'hsl({i*60}, 70%, 50%)', f'Service {i}')

    for i in range(1, 6):
        create_svg(f'testimonial{i}.jpg', f'hsl({i*72}, 70%, 50%)', f'Student {i}')

    create_svg('hero.jpg', '#667eea', 'Learn English')
    create_svg('instructor.jpg', '#764ba2', 'Rajesh Kumar')

    print("[OK] SVG placeholder images created successfully!")
