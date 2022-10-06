FROM quay.io/lyfe00011/md:beta
RUN git clone https://github.com/SPARK-SHADOW/Wa-Bot-Xd /Shadow-Xd/
WORKDIR /Shadow-Xd/
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]
