# Nemu app prototype

Responsive mobile app prototype with Belanja, Makan, Foto, Sehat, Chat, and profile screens.

## Run locally

From this repository directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/.

Includes product browsing, category and brand filters, restaurant menus and a demo basket, food logging, daily missions and demo rewards, and assistant chat UI. Catalog data, calorie estimates, rewards, orders, and chat responses are demonstrations. No backend, payment processing, or AI analysis is connected. Daily mission progress is stored locally in the browser.

The Foto menu includes two interactive demo flows:

- **Foto Makanan:** select a sample or a photo from camera/gallery, view clearly labeled sample nutrition data, adjust the portion, and save the entry to Diary.
- **Snap · List · Sell:** select a photo, edit the sample listing, and publish it immediately to the device's demo catalog. Listings, images, prices, and descriptions survive a refresh in localStorage; no listing is published to a production marketplace.

**Nemu Teman** is available from the Teman menu and floating mascot. Live and Affiliate invitations open in a centered modal, once per tab session on Belanja, after other dialogs have closed. Existing program cards can reopen the modal.

See [ATTRIBUTION.md](ATTRIBUTION.md) for asset information.
