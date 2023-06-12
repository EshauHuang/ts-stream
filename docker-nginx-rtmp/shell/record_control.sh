#!/bin/sh

LIMIT_GENERATE_WAITING_COUNT=0
LOG_FILE="/opt/data/client/access.log"
videoId=$(echo $2 | cut -d'_' -f1)
OUTPUT_DIR="/opt/data/records/$videoId/$2"

# VARIANT_NAMES="${videoId}_240p528kbs"

VARIANT_NAMES="${videoId}_1080p4628kbs ${videoId}_720p2628kbs ${videoId}_480p1128kbs ${videoId}_360p878kbs ${videoId}_240p528kbs"

mkdir -p "${OUTPUT_DIR}"

LOCK_FILE="/opt/data/records/${videoId}/check_m3u8.lock"

/usr/local/bin/ffmpeg -i "$1" -c:v copy -c:a copy -hls_time 10 -hls_list_size 0 -f hls -hls_segment_filename "${OUTPUT_DIR}/%d.ts" "${OUTPUT_DIR}/index.m3u8"

echo "$(date) - Finished processing recorded video: $1" >> "${LOG_FILE}"

if [ -f ${LOCK_FILE} ]; then
    echo "Exit: $2" >> "${LOG_FILE}"

    exit 0
fi

# Create a lock file to indicate the script is running
echo "Create a lock file to indicate the script is running ${LOCK_FILE}" >> "${LOG_FILE}"

touch ${LOCK_FILE}

while [ $LIMIT_GENERATE_WAITING_COUNT -lt 5 ]; do
    all_m3u8_exist=true

    for variant in ${VARIANT_NAMES}; do
        m3u8_path="/opt/data/records/${videoId}/${variant}/index.m3u8"
        if [ ! -f ${m3u8_path} ]; then
            all_m3u8_exist=false
            break
        fi
    done

    if ${all_m3u8_exist}; then
        echo "All m3u8 files exist. Generating master.m3u8." >> "${LOG_FILE}"
        /bin/sh /opt/data/shell/generate_master_m3u8.sh "${videoId}"
        break
    else
        LIMIT_GENERATE_WAITING_COUNT=$((LIMIT_GENERATE_WAITING_COUNT+1))
        echo "Waiting for m3u8 files... ${LIMIT_GENERATE_WAITING_COUNT}" >> "${LOG_FILE}"
        sleep 5
    fi
done

for variant in ${VARIANT_NAMES}; do
    record_path="/opt/data/records/${variant}.flv"
    if [ -f ${record_path} ]; then
        rm "${record_path}"
        echo "Removed ${record_path}" >> "${LOG_FILE}"
    fi
done

# Remove the lock file
rm ${LOCK_FILE}