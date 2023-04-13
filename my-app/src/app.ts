import {
  startLoadingPilets,
  initializeApi,
  PiletRequester,
  runPilet,
  getDefaultLoader,
  PiletApiCreator,
} from "piral-base";
import { registerComponent, unregisterComponent } from "./element";
import { events } from "./events";

const loadPilet = getDefaultLoader();

const createApi: PiletApiCreator = (target) => {
  const api = initializeApi(target, events);
  return Object.assign(api, {
    registerComponent,
    unregisterComponent,
  });
};

const fetchPilets: PiletRequester = () => {
  if (process.env.NODE_ENV === "production") {
    // Production - go against live feed
    return fetch("https://base-demo.my.piral.cloud/api/v1/pilet")
      .then((res) => res.json())
      .then((res) => res.items);
  } else {
    // Development - use relative URL, i.e., emulator API
    const url = `${location.origin}/$pilet-api`;
    const ws = new WebSocket(url.replace("http", "ws"));

    // listen to changes for unload / reload of pilet
    ws.onmessage = ({ data }) => {
      const meta = JSON.parse(data);
      const name = meta.name;

      events.emit("unload-pilet", { name });

      loadPilet(meta).then((pilet) => runPilet(createApi, pilet));
    };

    return fetch(url).then((res) => res.json());
  }
};

startLoadingPilets({
  fetchPilets,
  loadPilet,
  createApi,
});
