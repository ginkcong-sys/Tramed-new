# TradMed Agent — Bảng C (Vietnamese Student Hackathon 2026)
# Multi-task YHCT AI Agent: đọc /data/test.csv → ghi /output/pred.csv (A/B/C/D)
FROM nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/models \
    TRANSFORMERS_CACHE=/models \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
        python3.11 python3-pip git ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    ln -sf /usr/bin/python3.11 /usr/bin/python

WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Pre-download models vào image (offline khi chấm thi)
COPY scripts/download_models.py /app/scripts/download_models.py
RUN python /app/scripts/download_models.py

COPY . /app

VOLUME ["/data", "/output"]

ENTRYPOINT ["python", "-m", "tradmed_agent.run"]
