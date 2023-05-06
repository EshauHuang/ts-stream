#!/bin/bash
name=$1

mkdir -p /opt/data/records/$name/

# Generate the HLS segments using ffmpeg
/usr/local/bin/ffmpeg -i rtmp://localhost:1935/hls_live/$name -c:a aac -ac 2 -b:a 128k -c:v libx264 -preset medium -profile:v baseline -sc_threshold 0 -hls_time 10 -hls_list_size 0 -f hls -hls_segment_filename "/tmp/records/$name/%d.ts" /tmp/records/$name/index.m3u8



