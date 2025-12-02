import cv2
import numpy as np

def cartoonify_image(input_path, output_path):
    img = cv2.imread(input_path)

    # 1. Convert to gray
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 2. Smoothen
    gray_blur = cv2.medianBlur(gray, 7)

    # 3. Edge mask
    edges = cv2.adaptiveThreshold(
        gray_blur, 
        255,
        cv2.ADAPTIVE_THRESH_MEAN_C,
        cv2.THRESH_BINARY,
        9,
        9
    )

    # 4. Color smoothing
    color = cv2.bilateralFilter(img, 9, 250, 250)

    # 5. Combine
    cartoon = cv2.bitwise_and(color, color, mask=edges)

    cv2.imwrite(output_path, cartoon)
    return output_path
