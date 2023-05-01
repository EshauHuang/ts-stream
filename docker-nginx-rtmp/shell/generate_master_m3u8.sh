#!/bin/sh

LOG_FILE="/opt/data/client/access.log"
videoId=$1

echo "Entry video ${videoId} generate_master_m3u8.sh" >> "${LOG_FILE}"

OUTPUT_FILE="/opt/data/records/${videoId=$1}/master.m3u8"
RECORDS_PATH="/opt/data/records/${videoId=$1}"

# Write the header to the master.m3u8 file
echo "Write the header to the master.m3u8 file" >> "${LOG_FILE}"

cat > "${OUTPUT_FILE}" <<EOL
#EXTM3U
#EXT-X-VERSION:3
EOL

# Iterate through the subdirectories, extract bandwidth and resolution, and write them to the master.m3u8 file
echo "Iterate through the subdirectories, extract bandwidth and resolution, and write them to the master.m3u8 file" >> "${LOG_FILE}"

for dir in "${RECORDS_PATH}"/*; do
    echo "Processing directory: ${dir}" >> "${LOG_FILE}"

    if [ -d "${dir}" ]; then
        folder_name=$(basename "${dir}")
        m3u8_file="${folder_name}/index.m3u8"

        echo "Checking for file: ${RECORDS_PATH}/${m3u8_file}" >> "${LOG_FILE}"

        if [ -f "${RECORDS_PATH}/${m3u8_file}" ]; then
            echo "Found m3u8 file: ${RECORDS_PATH}/${m3u8_file}" >> "${LOG_FILE}"

            bandwidth=$(echo "${folder_name}" | grep -o -E '[0-9]+kbs' | tr -d 'kbs')
            resolution_label=$(echo "${folder_name}" | grep -o -E '[0-9]+p')

            # Convert the resolution label to its corresponding resolution
            case $resolution_label in
                "240p")
                    resolution="426x240"
                    ;;
                "360p")
                    resolution="640x360"
                    ;;
                "480p")
                    resolution="854x480"
                    ;;
                "720p")
                    resolution="1280x720"
                    ;;
                "1080p")
                    resolution="1920x1080"
                    ;;
                *)
                    resolution=""
                    ;;
            esac

            if [ ! -z "${resolution}" ]; then
                cat >> "${OUTPUT_FILE}" <<EOL
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=${bandwidth}000,RESOLUTION=${resolution}
${m3u8_file}
EOL
                echo "Wrote variant to master.m3u8 file: ${m3u8_file}" >> "${LOG_FILE}"
            fi
        else
            echo "m3u8 file not found: ${RECORDS_PATH}/${m3u8_file}" >> "${LOG_FILE}"
        fi
    fi
done

echo "Finished generate_master_m3u8.sh" >> "${LOG_FILE}"