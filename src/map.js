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
        'Personas ' + props.Personas + '<br />' +
        'Población de origen Venezuela ' + props.D_VEN  + '<br />' +  '<br />' +  

        '<b>Vivienda </b>' + '<br />' +
        'Vivienda adecuada: ' + props.VIV_ADE1 + '<br />' +
        'Espacio vital suficiente: ' + props.ESP_VIT.toFixed(0) + ' %' + '<br />' +
        'Agua mejorada: ' + props.AGUA1 + '<br />' +
        'Saneamiento: ' + props.SAN1 + '<br />' +
        'Electricidad: ' + props.ELEC1 + '<br />' +
        'Internet: ' + props.INTER1 + '<br />' + 
        'Dependencia económica: ' + props.D_ECONO.toFixed(2) + '<br />' + '<br />' +

        '<b>Salud</b>' + '<br />' +
        'Proximidad equipamientos de salud: ' + props.DxP_SALUD.toFixed(0) + ' m' + '<br />' +
        'Concentración de Pm10: ' + props.PM10.toFixed(2) + ' µg/m3' +  '<br />' +   
        'Contaminación residuos sólidos: ' + props.CON_SOL.toFixed(0) + ' %' + '<br />' + 
        'Esperanza de vida al nacer: ' + props.E_VIDA.toFixed(0) + ' años' + '<br />'  +  '<br />' +   
        
        '<b>Educación, cultura y diversidad </b>' + '<br />' +
        'Proximidad equipamientos culturales: ' + props.DxP_BIBLI.toFixed(0) + ' m' + '<br />' +
        'Proximidad equipamientos educativos: ' + props.DxP_EDUC.toFixed(0) + ' m' + '<br />' +
        'Diversidad tenencia: ' + props.MIX_TENE1 + '/1.79' + '<br />' +
        'Diversidad nivel educativo: ' + props.MIX_EDU.toFixed(2) +'/2.20' +  '<br />' +
        'Diversidad edades: ' + props.MIX_EDAD.toFixed(2) + '/1.79' + '<br />' +
        'Diversidad etnias y razas: ' + props.MIX_ETNIA.toFixed(2) + '/1.61' +'<br />' +
        'Años promedio educación: ' + props.ESC_ANOS.toFixed(0) + ' años'+ '<br />' +  '<br />' +  
        
        '<b>Espacios públicos, seguridad y recreación </b>' + '<br />' +
        'Proximidad espacio público: ' + props.DxP_EP.toFixed(0) + ' m' + '<br />' +
        'M² per capita de espacio público: ' + props.M2_ESP_PU.toFixed(2) + '<br />' +
        'Densidad poblacional: ' + props.DEN_POB.toFixed(2) + '<br />' +
        'Tasa de hurtos x 100mil habitantes: ' + props.HURTOS.toFixed(0) + '<br />' +
        'Tasa de homicidios x 100mil habitantes: ' + props.HOMICIDIOS.toFixed(0) + '<br />' +
        'Diversidad usos del suelo: ' + props.MIXTICIDAD.toFixed(2) + '/1.61' +'<br />' + '<br />' +

        '<b>Oportunidades económicas </b>' + '<br />' +
        'Proximidad a empresas: ' + props.P_EMPRE.toFixed(2)  + '<br />' +
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
        elem1: '<div><span  style= "color:#1a9641">▉</span>71 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>55 - 70</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>36 - 54</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>16 - 35</div>', 
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 15</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    ESP_VIT: {
        title: "Espacio vital suficiente",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>98 - 99</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>95 - 97</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>92 - 94</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>90 - 91</div>', 
        elem5: '<div><span  style= "color:#d7191c">▉</span>87 - 89</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI Necesidades básicas insatisfechas ",
    },
    AGUA: {
        title: "Acceso a agua mejorada",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>75 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>57 - 74</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>36 - 56</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>14 - 35</div>', 
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 13</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    SAN: {
        title: "Acceso a saneamiento",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>85 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>68 - 84</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>45 - 67</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>21 - 44</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 20</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    ELEC: {
        title: "Acceso a electricidad",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>87 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>72 - 86</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>52 - 71</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>25 - 51</div>', 
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 24</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    INTER: {
        title: "Acceso a internet",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>80 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>61 - 79</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>39 - 60</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>15 - 38</div>',  
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 14</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    D_ECONO: {
        title: "Dependencia económica",
        subtitle: "Población/Población ocupada",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.00 - 2.00</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>2.01 - 2.18</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>2.19 - 3.16</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3.17 - 7.00</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>7.01 - 17.60</div>',
        elem6: '',
        elem7: '',
        elem8: "DANE Censo Nacional Población y Vivienda 2018",
    },
    DxP_SALUD: {
        title: "Proximidad equipamientos de salud",
        subtitle: "Distancia en metros con factor de inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1001 - 3000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3001 - 5000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>5001 - 15874</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Instituto Catastral de Lima 2018",
    },
    PM10: {
        title: "Concentración Pm10",
        subtitle: "µg/m3",
        elem1: '<div><span  style= "color:#1a9641">▉</span>34 - 58</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>59 - 73</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>74 - 87</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>88 - 101</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>102 - 120</div>',
        elem6: '',
        elem7: '',
        elem8: "Ministerio de Salud Programa Nacional de Vigilancia Sanitaria de Calidad del Aire Lima - Callao 2019",
    },
    CON_SOL: {
        title: "Contaminación residuos sólidos",
        subtitle: "% Distrito",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 1</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>2 - 4</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>5 - 13</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>14 - 27</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>28 - 57</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    E_VIDA: {
        title: "Esperanza de vida al nacer",
        subtitle: "Años",
        elem1: '<div><span  style= "color:#1a9641">▉</span>85 - 86</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>83 - 84</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>81 - 82</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>79 - 80</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>77 - 78</div>',
        elem6: '',
        elem7: '',
        elem8: "Índice de Desarrollo Humano distrital",
    },
    DxP_BIBLI: {
        title: "Proximidad equipamientos culturales",
        subtitle: "Distancia en metros con factor de inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1001 - 5000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>5001 - 10000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>10001 - 27821</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Instituto Catastral de Lima, Google maps 2020",
    },
    DxP_EDUC: {
        title: "Proximidad equipamientos educativos",
        subtitle: "Distancia en metros con factor de inclinación del terreno",  
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 300</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>301 - 500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>501 - 1000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1001 - 2000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2001 - 5112</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Ministerio de Educación del Perú 2018",
    },
    ESC_ANOS: {
        title: "Años promedio educación",
        subtitle: "años",
        elem1: '<div><span  style= "color:#1a9641">▉</span>16 - 18</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>14 - 15</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>12 - 13</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>10 - 11</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 9</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    T_DESEM: {
        title: "Tasa de desempleo",
        subtitle: "% Personas",
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
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#d7191c">▉</span>0 - 40</div>',
        elem2: '<div><span  style= "color:#fdae61">▉</span>41 - 55</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>56 - 60</div>',
        elem4: '<div><span  style= "color:#a6d96a">▉</span>61 - 75</div>',
        elem5: '<div><span  style= "color:#1a9641">▉</span>76 - 100</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    MIX_TENE: {
        title: "Diversidad tenencia",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por grilla",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.12 - 1.39</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.95 - 1.11</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.73 - 0.94</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.43 - 0.72</div>',  
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.42</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    MIX_EDU: {
        title: "Diversidad nivel educativo",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por grilla",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.35 - 1.67</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.16 - 1.34</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.92 - 1.15</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.42 - 0.91</div>',  
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.41</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    MIX_EDAD: {
        title: "Diversidad edades",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por grilla",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.56 - 1.67</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.51 - 1.55</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>1.36 - 1.50</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.10 - 1.35</div>',  
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.09</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    MIX_ETNIA: {
        title: "Diversidad etnias y razas",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por grilla",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.02 - 1.53</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.90 - 1.01</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.75 - 0.89</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.39 - 0.74</div>',  
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.38</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    DxP_EP: {
        title: "Proximidad espacio público",
        subtitle: "Distancia en metros con factor de inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1001 - 3000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3001 - 5000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>5001 - 14437</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Instituto Catastral de Lima",
    },
    M2_ESP_PU: {
        title: "M² per capita de espacio público",
        subtitle: "m²/habitante",
        elem1: '<div><span  style= "color:#1a9641">▉</span>Mayor 5.81</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>3.53 - 5.80</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1.90 - 3.52</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.61 - 0.89</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.60</div>',
        elem6: '',
        elem7: '',
        elem8: "Instituto Catastral de Lima",
    },
    MIXTICIDAD: {
        title: "Diversidad usos del suelo",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por grilla",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.54 - 1.09</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.30 - 0.53</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.18 - 0.29</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.08 - 0.17</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.07</div>',
        elem6: '',
        elem7: '',
        elem8: "Instituto Catastral de Lima",
    },
    HURTOS: {
        title: "Tasa de hurtos",
        subtitle: "Hurtos x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>15 - 296</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>297 - 419</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>420 - 575</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>576 - 1082</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>1083 - 1741</div>',
        elem6: '',
        elem7: '',
        elem8: "Datacrim - INEI 2019",
    },
    HOMICIDIOS: {
        title: "Tasa de homicidios",
        subtitle: "Homicidios x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 5</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>6 - 7</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>8 - 11</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>12 - 16</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>17 - 24</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI Tasa de homicidios según distritos 2018",
    },
    VEN: {
        title: "Población de origen Venezuela",
        subtitle: "Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>2901 - 10637</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>10638 - 20307</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>20308 - 28817</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>28818 - 40614</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>40615 - 58213</div>',
        elem6: '',
        elem7: '',
        elem8: "Municipalidad Metropolitana de Lima",
    },
    P_EMPRE: {
        title: "Proporción de empresas",
        subtitle: "Relación de cantidad de empresas en la grilla",
        elem1: '<div><span  style= "color:#1a9641">▉</span>26.37 - 54.76</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>10.37 - 26.36</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>5.42 - 10.36</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>2.47 - 5.41</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.33 - 2.46</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI",
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
        return d > 100 ? '#c3bfc2' :
                d > 70 ? '#1a9641' :
                 d > 54 ? '#a6d96a' :
                  d > 35 ? '#f4f466' :
                    d > 14 ? '#fdae61' :
                        '#d7191c';
    }else if (currentStyle === 'ESP_VIT') {
        return d > 100 ? '#c3bfc2' :
                d > 97 ? '#1a9641' :
                 d > 94 ? '#a6d96a' :
                  d > 91 ? '#f4f466' :
                    d > 89 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'AGUA') {
        return d > 100 ? '#c3bfc2' :
                d > 74 ? '#1a9641' :
                 d > 56 ? '#a6d96a' :
                  d > 35 ? '#f4f466' :
                    d > 13 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'SAN') {
        return d > 100 ? '#c3bfc2' :
        d > 84 ? '#1a9641' :
            d > 67 ? '#a6d96a' :
                d > 44 ? '#f4f466' :
                    d > 20 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'ELEC') {
        return d > 100 ? '#c3bfc2' :
        d > 86 ? '#1a9641' :
            d > 71 ? '#a6d96a' :
                d > 51 ? '#f4f466' :
                    d > 24 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'INTER') {
        return d > 100 ? '#c3bfc2' :
        d > 79 ? '#1a9641' :
            d > 60 ? '#a6d96a' :
                d > 30 ? '#f4f466' :
                    d > 14 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'D_ECONO') {
        return d > 7 ? '#d7191c' :
            d > 3.16 ? '#fdae61' :
                d > 2.18 ? '#f4f466' :
                    d > 2 ? '#a6d96a' :
                        '#1a9641';
    } 
    else if (currentStyle === 'DxP_SALUD') {
        return d > 5000 ? '#d7191c' :
                    d > 3000? '#fdae61' :
                         d > 1000 ? '#f4f466' :
                                d > 500 ? '#a6d96a' :
                                '#1a9641';
    } 
    else if (currentStyle === 'PM10') {
        return d > 101 ? '#d7191c' :
                    d > 87 ? '#fdae61' :
                         d > 73 ? '#f4f466' :
                                d > 58 ? '#a6d96a' :
                                '#1a9641';
    } 
    else if (currentStyle === 'CON_SOL') {
        return d > 27 ? '#d7191c' :
                    d > 13 ? '#fdae61' :
                         d > 4 ? '#f4f466' :
                                d > 1 ? '#a6d96a' :
                                '#1a9641';
    } 
    else if (currentStyle === 'E_VIDA') {
        return d > 84 ? '#1a9641' :
            d > 82 ? '#a6d96a' :
                d > 80 ? '#f4f466' :
                    d > 78 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'DxP_BIBLI') {
        return d > 10000 ? '#d7191c' :
                    d > 5000? '#fdae61' :
                         d > 1000 ? '#f4f466' :
                                d > 500 ? '#a6d96a' :
                                '#1a9641';
    } 
    else if (currentStyle === 'DxP_EDUC') {
        return d > 2000 ? '#d7191c' :
                    d > 1000? '#fdae61' :
                         d > 500 ? '#f4f466' :
                                d > 300 ? '#a6d96a' :
                                '#1a9641';
    }
    else if (currentStyle === 'MIX_TENE') {
        return d > 100 ? '#c3bfc2' :
        d > 1.11 ? '#1a9641' :
            d > 0.94 ? '#a6d96a' :
                d > 0.72 ? '#f4f466' :
                    d > 0.42 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'MIX_EDU') {
        return d > 1.34 ? '#1a9641' :
            d > 1.15 ? '#a6d96a' :
                d > 0.91 ? '#f4f466' :
                    d > 0.40 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'MIX_EDAD') {
        return d > 1.55 ? '#1a9641' :
            d > 1.50 ? '#a6d96a' :
                d > 1.35 ? '#f4f466' :
                    d > 0.09 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'MIX_ETNIA') {
        return d > 1.01 ? '#1a9641' :
            d > 0.89 ? '#a6d96a' :
                d > 0.74 ? '#f4f466' :
                    d > 0.38 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'ESC_ANOS') {
        return d > 15 ? '#1a9641' :
            d > 13? '#a6d96a' :
                d > 11 ? '#f4f466' :
                    d > 9 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'DxP_EP') {
        return d > 5000 ? '#d7191c' :
                    d > 3000? '#fdae61' :
                         d > 1000 ? '#f4f466' :
                                d > 500 ? '#a6d96a' :
                                '#1a9641';
    }
    else if (currentStyle === 'M2_ESP_PU') {
        return d > 5.80 ? '#1a9641' :
            d > 3.52? '#a6d96a' :
                d > 1.89 ? '#f4f466' :
                    d > 0.60 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'MIXTICIDAD') {
        return d > 0.53 ? '#1a9641' :
            d > 0.29 ? '#a6d96a' :
                d > 0.17 ? '#f4f466' :
                    d > 0.07 ? '#fdae61' :
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
    else if (currentStyle === 'HOMICIDIOS') {
        return d >16 ? '#d7191c' :
                    d > 11? '#fdae61' :
                        d > 7 ? '#f4f466' :
                            d > 5 ? '#a6d96a' :
                            '#1a9641';
    } 
    else if (currentStyle === 'HURTOS') {
        return d >1082 ? '#d7191c' :
                    d > 575 ? '#fdae61' :
                        d > 419 ? '#f4f466' :
                            d > 296 ? '#a6d96a' :
                            '#1a9641';
    } 
    else if (currentStyle === 'VEN') {
        return d >40614 ? '#d7191c' :
                    d > 28817 ? '#fdae61' :
                        d > 20307 ? '#f4f466' :
                            d > 10637 ? '#a6d96a' :
                            '#1a9641';
    } 
    else if (currentStyle === 'P_EMPRE') {
        return d > 26.36 ? '#1a9641':
                        d > 10.36 ?  '#a6d96a':
                            d > 5.41 ? '#f4f466' :
                                d > 2.46 ? '#fdae61':
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
