import cv2
import os
import subprocess

os.chdir(r"C:\Users\1pawd_34dlf19\Documents\GitHub\updated-pippikittycat.github.io\assets\videos")

input_path = "social_media_video.mp4"  # relative now because of os.chdir()
output_path = "social_media_video_blurred.mp4"

cap = cv2.VideoCapture(input_path)

fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

new_width = width // 2
new_height = height // 2

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (new_width, new_height))

print("Processing video...")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    blurred_frame = cv2.GaussianBlur(frame, (5, 5), 0)
    resized_frame = cv2.resize(blurred_frame, (new_width, new_height))

    out.write(resized_frame)

cap.release()
out.release()

print("Video processing done. Starting ffmpeg re-encode...")

# Re-encode the video for browser compatibility
subprocess.run([
    "ffmpeg", "-i", output_path,
    "-vcodec", "libx264",
    "-acodec", "aac",
    "-movflags", "+faststart",
    "social_media_video_fixed.mp4"
])

print("✅ Video re-encoded for browser compatibility.")
print("Video processing complete!")
