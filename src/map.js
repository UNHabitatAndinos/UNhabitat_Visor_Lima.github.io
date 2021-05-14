var map = L.map('map', {
    center: [-12.06, -76.98],
    zoom: 10,
    minZoom: 10,
    scrollWheelZoom: false,
});

map.once('focus', function() { map.scrollWheelZoom.enable(); });

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [-12.06, -76.98];
    map.setView(cucu, 10);
}).addTo(map);


var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        'Distrito ' + props.DISTRITO + '<br />' +
        'Viviendas ' + props.VIVIEN + '<br />' +
        'Hogares ' + props.HOG + '<br />' +
        'Personas ' + props.Personas + '<br />' + '<br />' +

        '<b>Vivienda </b>' + '<br />' +
        'Vivienda adecuada: ' + props.VIV_ADE.toFixed(0) + ' %' + '<br />' +
        'Espacio vital suficiente: ' + props.ESP_VIT.toFixed(0) + ' %' + '<br />' +
        'Agua mejorada: ' + props.AGUA.toFixed(0) + ' %' + '<br />' +
        'Saneamiento: ' + props.SAN.toFixed(0) + ' %' + '<br />' +
        'Electricidad: ' + props.ELEC.toFixed(0) + ' %' + '<br />' +
        'Internet: ' + props.INTER.toFixed(0) + ' %'   + '<br />' + 
        'Dependencia económica: ' + props.D_ECONO.toFixed(2) + '<br />' + '<br />' +

        '<b>Salud</b>' + '<br />' +
        'Proximidad equipamientos de salud: ' + props.DxP_SALUD.toFixed(0) + ' m' + '<br />' +
        'Concentración de Pm10: ' + props.PM10.toFixed(2) + ' µg/m3' +  '<br />' +   
        //'Contaminación residuos sólidos: ' + props.CON_SOL.toFixed(0) + ' %' + '<br />' + 
        'Esperanza de vida al nacer: ' + props.E_VIDA.toFixed(0) + ' años' + '<br />'  +  '<br />' +   
        
        '<b>Educación, cultura y diversidad </b>' + '<br />' +
        'Proximidad equipamientos culturales: ' + props.DxP_BIBLI.toFixed(0) + ' m' + '<br />' +
        'Proximidad equipamientos educativos: ' + props.DxP_EDUC.toFixed(0) + ' m' + '<br />' +
        'Diversidad tenencia: ' + props.MIX_TENE.toFixed(2) + '/1.79' + '<br />' +
        'Diversidad nivel educativo: ' + props.MIX_EDU.toFixed(2) +'/2.20' +  '<br />' +
        'Diversidad edades: ' + props.MIX_EDAD.toFixed(2) + '/1.79' + '<br />' +
        'Diversidad etnias y razas: ' + props.MIX_ETNIA.toFixed(2) + '/1.61' +'<br />' +
        'Años promedio educación: ' + props.ESC_ANOS.toFixed(0) + ' años'+ '<br />' +  '<br />' +  
        
        '<b>Espacios públicos, seguridad y recreación </b>' + '<br />' +
        'Proximidad espacio público: ' + props.DxP_EP.toFixed(0) + ' m' + '<br />' +
        'M² per capita de espacio público: ' + props.M2_ESP_PU.toFixed(2) + '<br />' +
        'Densidad poblacional: ' + props.DEN_POB.toFixed(2) + '<br />' +
        'Diversidad usos del suelo: ' + props.Shanon_Cel.toFixed(2) + '/1.61' +'<br />' + '<br />' +

        '<b>Oportunidades económicas </b>' + '<br />' +
        'Desempleo: ' + props.T_DESEM.toFixed(0) + ' %' + '<br />' +
        'Empleo: ' + props.EMPLEO.toFixed(0) + ' %' : 'Seleccione una manzana');
};
info.addTo(map);


function stylec(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0,
        dashArray: '3',
    };
}

var loc = L.geoJson(distrito, {
    style: stylec,
    onEachFeature: popupText,
}).addTo(map);



function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillColor: false
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var manzanas;

function resetHighlight(e) {
    manzanas.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.5,
        color: '#ffffff00',
        fillOpacity: 0,
    };
}



function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p style="font-size: 10px">${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    DEN_POB: {
        title: "Densidad residencial",
        subtitle: "Habitantes por km2",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 4</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>5 - 10</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>11 - 17</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>17 - 26</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>27 - 59</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    VIV_ADE: {
        title: "Vivienda adecuada",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d7191c">▉</span>0 - 14</div>',
        elem2: '<div><span  style= "color:#fdae61">▉</span>15 - 38</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>39 - 60</div>',
        elem4: '<div><span  style= "color:#a6d96a">▉</span>61 - 79</div>',
        elem5: '<div><span  style= "color:#1a9641">▉</span>80 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    AGUA: {
        title: "Acceso a agua mejorada",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d7191c">▉</span>0 - 16</div>',
        elem2: '<div><span  style= "color:#fdae61">▉</span>17 - 43</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>44 - 67</div>',
        elem4: '<div><span  style= "color:#a6d96a">▉</span>68 - 84</div>',
        elem5: '<div><span  style= "color:#1a9641">▉</span>85 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    SAN: {
        title: "Acceso a saneamiento",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d7191c">▉</span>0 - 20</div>',
        elem2: '<div><span  style= "color:#fdae61">▉</span>21 - 44</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>45 - 67</div>',
        elem4: '<div><span  style= "color:#a6d96a">▉</span>68 - 84</div>',
        elem5: '<div><span  style= "color:#1a9641">▉</span>85 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    ELEC: {
        title: "Acceso a electricidad",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d7191c">▉</span>0 - 24</div>',
        elem2: '<div><span  style= "color:#fdae61">▉</span>25 - 51</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>52 - 71</div>',
        elem4: '<div><span  style= "color:#a6d96a">▉</span>72 - 86</div>',
        elem5: '<div><span  style= "color:#1a9641">▉</span>87 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    INTER: {
        title: "Acceso a internet",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d7191c">▉</span>0 - 14</div>',
        elem2: '<div><span  style= "color:#fdae61">▉</span>15 - 38</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>39 - 60</div>',
        elem4: '<div><span  style= "color:#a6d96a">▉</span>61 - 79</div>',
        elem5: '<div><span  style= "color:#1a9641">▉</span>80 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    VIV_ALQ: {
        title: "Viviendas alquiladas",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 8</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>9 - 18</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>19 - 31</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>32 - 60</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>61 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    P_ESCO: {
        title: "Años promedio educación",
        subtitle: "años",
        elem1: '<div><span  style= "color:#d7191c">▉</span>0 - 8</div>',
        elem2: '<div><span  style= "color:#fdae61">▉</span>9 - 10</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>11 - 12</div>',
        elem4: '<div><span  style= "color:#a6d96a">▉</span>13 - 15</div>',
        elem5: '<div><span  style= "color:#1a9641">▉</span>16 - 18</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    T_DESEM: {
        title: "Tasa de desempleo",
        subtitle: "%",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 4</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>5 - 7</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>8 - 16</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>17 - 50</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>51 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    EMPLEO: {
        title: "Empleo",
        subtitle: "%",
        elem1: '<div><span  style= "color:#d7191c">▉</span>0 - 40</div>',
        elem2: '<div><span  style= "color:#fdae61">▉</span>41 - 55</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>56 - 60</div>',
        elem4: '<div><span  style= "color:#a6d96a">▉</span>61 - 75</div>',
        elem5: '<div><span  style= "color:#1a9641">▉</span>76 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
}

var indi = L.geoJson(Manzana, {
    style: legends.DEN_POB,
}).addTo(map);

var currentStyle = 'DEN_POB';


manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function setProColor(d) {
    if (currentStyle === 'DEN_POB') {
        return d > 26 ? '#d7191c' :
            d > 17 ? '#fdae61' :
                d > 10 ? '#f4f466' :
                    d > 4 ? '#a6d96a' :
                        '#1a9641';
    }else if (currentStyle === 'VIV_ADE') {
        return d > 79 ? '#1a9641' :
            d > 60 ? '#a6d96a' :
                d > 38 ? '#f4f466' :
                    d > 14 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'AGUA') {
        return d > 84 ? '#1a9641' :
            d > 67 ? '#a6d96a' :
                d > 43 ? '#f4f466' :
                    d > 16 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'SAN') {
        return d > 84 ? '#1a9641' :
            d > 67 ? '#a6d96a' :
                d > 44 ? '#f4f466' :
                    d > 20 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'ELEC') {
        return d > 86 ? '#1a9641' :
            d > 71 ? '#a6d96a' :
                d > 51 ? '#f4f466' :
                    d > 24 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'INTER') {
        return d > 79 ? '#1a9641' :
            d > 60 ? '#a6d96a' :
                d > 30 ? '#f4f466' :
                    d > 14 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'VIV_ALQ') {
        return d > 60 ? '#d7191c' :
            d > 31 ? '#fdae61' :
                d > 18 ? '#f4f466' :
                    d > 8 ? '#a6d96a' :
                        '#1a9641';
    } 
    else if (currentStyle === 'P_ESCO') {
        return d > 15 ? '#1a9641' :
            d > 13? '#a6d96a' :
                d > 10 ? '#f4f466' :
                    d > 8 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'T_DESEM') {
        return d > 50 ? '#d7191c' :
                    d > 16? '#fdae61' :
                        d > 7 ? '#f4f466' :
                            d > 5 ? '#a6d96a' :
                            '#1a9641';
    } 
    else if (currentStyle === 'EMPLEO') {
        return d > 75 ? '#1a9641':
                        d > 60 ?  '#a6d96a':
                            d > 55 ? '#f4f466' :
                                d > 40 ? '#fdae61':
                                '#d7191c';
    } 
    else {
        return d > 4000 ? '#1a9641':
                        d > 3000 ?  '#a6d96a':
                            d > 2000 ? '#f4f466' :
                                d > 1000 ? '#fdae61':
                                '#d7191c';
    }

}

function fillColor(feature) {
    return {
        fillColor:  setProColor(feature.properties[currentStyle]),
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle) ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle) ? 0.7 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'DEN_POB'});

function popupText(feature, layer) {
    layer.bindPopup('Distrito ' + feature.properties.DISTRITO + '<br />')
}