export function fetchDataJson(url) {
  /** Simple fetch. Nothing more, nothing less. */
  return fetch(url);
}

export function randomizeMarkers(data) {
  const markers = [];

  const imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' +
    'chco=FFFFFF,008CFF,000000&ext=.png';
  const markerImage = new google.maps.MarkerImage(imageUrl,
    new google.maps.Size(24, 32));

  for (let i = 0; i < 10; ++i) {
    const latLng = new google.maps.LatLng(
      data.photos[i].latitude,
      data.photos[i].longitude)
    const marker = new google.maps.Marker({
      position: latLng,
      icon: markerImage
    });
    markers.push(marker);
  }

  return markers;
}
