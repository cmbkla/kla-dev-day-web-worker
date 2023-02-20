const isProcessing = false;

onconnect = function (e) {
  const port = e.ports[0];

  port.onmessage = function (e) {
    if (!Array.isArray(e.data)) {
      port.postMessage("bad");
      return;
    }
    if (isProcessing) {
      port.postMessage("already");
      return;
    }

    port.postMessage("starting");
    e.data.forEach(r => {
      for (let step = 0; step < 1000; step++) {
        console.log(`${r.id}-${step}`);
      }
    });

    port.postMessage("done");
  };
};
