from PIL import Image

def make_transparent(input_path, output_path, tolerance=25):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    # Assume the top-left pixel is the background color
    bg_color = datas[0]
    
    newData = []
    for item in datas:
        # Check if current pixel is within the tolerance range of the background color
        if (abs(item[0] - bg_color[0]) <= tolerance and
            abs(item[1] - bg_color[1]) <= tolerance and
            abs(item[2] - bg_color[2]) <= tolerance):
            # Make it fully transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")
    print("Background removed and saved to:", output_path)

if __name__ == "__main__":
    make_transparent(r"d:\Projects\project 0\public\mascot.jpg", r"d:\Projects\project 0\public\mascot.png")
