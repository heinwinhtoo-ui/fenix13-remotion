# Asset provenance

## Brand asset

`public/brand/fenix13-chill-grill.png` is an animation asset prepared from the
user-supplied phoenix logo through image editing. The inline reference was not
available as a downloadable source file in the workspace, so this is a cleaned
reconstruction, not a claim of a pixel-identical copy of the original file.
It retains the phoenix, feather shapes, mountains, star, ring, FENIX /13 wordmark,
and CHILL & GRILL descriptor. The complete asset is preserved for replacement
with the original PNG/SVG when available. Animation uses masks and transforms;
there is no generated moving animal or new mascot.

## Geography

All geographic source vectors are **Natural Earth public-domain data**:
https://www.naturalearthdata.com/about/terms-of-use/

Source repository: https://github.com/nvkelso/natural-earth-vector

- `geojson/ne_110m_admin_0_countries.geojson`: globe countries.
- `geojson/ne_10m_admin_0_countries.geojson`: detailed Myanmar outline.
- `geojson/ne_10m_admin_1_states_provinces.geojson`: Myanmar state boundaries.
- `geojson/ne_10m_roads.geojson`: generalized actual regional road lines.
- `geojson/ne_10m_populated_places.geojson`: Taunggyi point (97.038001, 20.781999).
- `geojson/ne_10m_lakes.geojson`: optional regional water features. No selected
  lake is present in this region in that dataset; none is fabricated.

`scripts/geodata.py` extracts the source features to `src/geodata.json`. That
bundled result is sufficient for preview and render; no live map API is needed.
Administrative boundaries are generalized cartographic features. The Taunggyi
view is a regional locator, not a surveyed city boundary or street-level map.
The pin refers to the city, not to an unprovided business address.

## Music, effects, and type

Music, sound effects, and the ident melody are original tonal synthesis in
`scripts/score.py`, with separately editable stereo stems and a cue sheet. No
third-party music, recordings, sample loops, noise bed, or voice are used.
Syne, Manrope, and Space Mono are bundled under the SIL Open Font License; their
license texts are included in `public/fonts/`. Software dependencies retain
their respective package licenses.
