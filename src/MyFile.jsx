import { useState, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import {
  ChevronRight, ChevronDown, ThumbsUp, ThumbsDown, MessageCircle, Send,
  Check, Vote, Users, Lightbulb, ClipboardCheck, BarChart3, BookOpen,
  MapPin, Calendar, ArrowRight, X, Layers, Database, AlertTriangle,
  Activity, FileText, ExternalLink, Info
} from "lucide-react";

// ─── EMBEDDED GEOJSON (simplified, ~9KB) ──────────────────────────────────────
const WARD_GEOJSON = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"ward_no":2},"geometry":{"type":"Polygon","coordinates":[[[75.9331,11.7401],[75.9283,11.7405],[75.9257,11.7376],[75.9304,11.736],[75.9329,11.7328],[75.9319,11.7281],[75.9337,11.7279],[75.9325,11.7259],[75.9347,11.724],[75.9399,11.7267],[75.9377,11.7305],[75.9386,11.732],[75.9331,11.7401]]]}},{"type":"Feature","properties":{"ward_no":3},"geometry":{"type":"Polygon","coordinates":[[[75.9487,11.7413],[75.9519,11.7432],[75.9514,11.7449],[75.9469,11.7438],[75.9445,11.7411],[75.942,11.7428],[75.9344,11.7424],[75.9328,11.7407],[75.939,11.7319],[75.946,11.7339],[75.9485,11.7331],[75.9449,11.7402],[75.9479,11.7399],[75.9487,11.7413]]]}},{"type":"Feature","properties":{"ward_no":4},"geometry":{"type":"Polygon","coordinates":[[[75.9485,11.7331],[75.946,11.7339],[75.9379,11.7312],[75.9406,11.7251],[75.9381,11.7202],[75.9373,11.7121],[75.9428,11.7123],[75.9391,11.7172],[75.9458,11.7207],[75.9468,11.7263],[75.9497,11.7298],[75.9485,11.7331]]]}},{"type":"Feature","properties":{"ward_no":5},"geometry":{"type":"Polygon","coordinates":[[[75.9562,11.7442],[75.9527,11.7467],[75.9519,11.7432],[75.9491,11.7425],[75.9481,11.74],[75.9449,11.7402],[75.9497,11.7298],[75.9468,11.7263],[75.9463,11.7226],[75.9509,11.7231],[75.9507,11.728],[75.9549,11.7325],[75.9599,11.7264],[75.9599,11.7318],[75.9572,11.734],[75.9586,11.7353],[75.9552,11.7359],[75.9548,11.7416],[75.9562,11.7442]]]}},{"type":"Feature","properties":{"ward_no":6},"geometry":{"type":"Polygon","coordinates":[[[75.966,11.7556],[75.958,11.7519],[75.9582,11.7499],[75.9559,11.7468],[75.957,11.7452],[75.9548,11.7416],[75.9552,11.7359],[75.9586,11.7354],[75.9572,11.734],[75.959,11.7322],[75.9644,11.7304],[75.9676,11.732],[75.9701,11.7374],[75.9686,11.7542],[75.966,11.7556]]]}},{"type":"Feature","properties":{"ward_no":1},"geometry":{"type":"Polygon","coordinates":[[[75.9261,11.7392],[75.9187,11.7411],[75.9121,11.7381],[75.9094,11.7322],[75.9086,11.7216],[75.9114,11.723],[75.9106,11.7214],[75.9163,11.7167],[75.9219,11.718],[75.9197,11.7223],[75.9215,11.727],[75.9265,11.7302],[75.9317,11.7304],[75.933,11.7325],[75.9304,11.736],[75.9263,11.7366],[75.9261,11.7392]]]}},{"type":"Feature","properties":{"ward_no":7},"geometry":{"type":"Polygon","coordinates":[[[75.969,11.753],[75.9697,11.738],[75.9746,11.7376],[75.9766,11.7387],[75.9767,11.741],[75.9819,11.7426],[75.9843,11.7453],[75.9827,11.7473],[75.9842,11.749],[75.9832,11.751],[75.9824,11.7476],[75.9811,11.7473],[75.9754,11.752],[75.969,11.753]]]}},{"type":"Feature","properties":{"ward_no":8},"geometry":{"type":"Polygon","coordinates":[[[75.9819,11.7319],[75.9799,11.7337],[75.9813,11.7369],[75.9777,11.7386],[75.9727,11.7369],[75.9701,11.7379],[75.968,11.7352],[75.9678,11.7323],[75.9732,11.7283],[75.9692,11.7259],[75.9741,11.7222],[75.9726,11.7196],[75.9743,11.7169],[75.9789,11.7219],[75.9765,11.724],[75.9749,11.7289],[75.9776,11.7309],[75.9811,11.7261],[75.9836,11.726],[75.9819,11.7319]]]}},{"type":"Feature","properties":{"ward_no":9},"geometry":{"type":"Polygon","coordinates":[[[75.9856,11.7462],[75.9819,11.7426],[75.9767,11.741],[75.9766,11.7387],[75.9813,11.7369],[75.9799,11.7337],[75.9819,11.7319],[75.9863,11.735],[75.9858,11.7364],[75.9937,11.7412],[75.9873,11.7437],[75.9881,11.7453],[75.9856,11.7462]]]}},{"type":"Feature","properties":{"ward_no":10},"geometry":{"type":"Polygon","coordinates":[[[76.0119,11.7529],[76.0102,11.7515],[76.0076,11.7523],[75.9993,11.7497],[75.9969,11.7515],[75.9864,11.7531],[75.9832,11.7517],[75.9842,11.749],[75.9827,11.7473],[75.9873,11.746],[75.9873,11.7437],[75.9937,11.7412],[76.0012,11.7468],[76.0005,11.7427],[76.0022,11.7425],[76.0041,11.743],[76.0046,11.7474],[76.0071,11.7472],[76.0077,11.7491],[76.0093,11.746],[76.0129,11.7461],[76.0119,11.7529]]]}},{"type":"Feature","properties":{"ward_no":11},"geometry":{"type":"Polygon","coordinates":[[[76.0008,11.7417],[76.0016,11.7466],[76.0005,11.7469],[75.9955,11.7417],[75.9858,11.7364],[75.9863,11.735],[75.987,11.734],[75.9906,11.7353],[75.9946,11.733],[75.9906,11.7318],[75.9915,11.7294],[75.9966,11.7283],[75.9975,11.7302],[76.0001,11.7274],[76.004,11.7268],[76.0035,11.7289],[76.0069,11.7309],[76.0064,11.7333],[76.0008,11.7417]]]}},{"type":"Feature","properties":{"ward_no":12},"geometry":{"type":"Polygon","coordinates":[[[76.0129,11.7461],[76.0093,11.746],[76.0077,11.7491],[76.0071,11.7472],[76.0046,11.7474],[76.0041,11.743],[76.0005,11.7427],[76.0054,11.7353],[76.0048,11.7341],[76.008,11.7334],[76.0102,11.735],[76.0108,11.7331],[76.0166,11.7325],[76.0227,11.7351],[76.0237,11.7379],[76.0219,11.7414],[76.0193,11.7381],[76.0172,11.7393],[76.017,11.7414],[76.014,11.7397],[76.0153,11.7439],[76.0129,11.7447],[76.0129,11.7461]]]}},{"type":"Feature","properties":{"ward_no":13},"geometry":{"type":"Polygon","coordinates":[[[76.0211,11.7411],[76.0163,11.7449],[76.015,11.7486],[76.0234,11.7548],[76.0207,11.7557],[76.0208,11.7584],[76.0176,11.7576],[76.0177,11.7597],[76.0152,11.7578],[76.0134,11.7586],[76.0129,11.7447],[76.0153,11.7439],[76.0139,11.7399],[76.017,11.7414],[76.0172,11.7393],[76.0193,11.7381],[76.0211,11.7411]]]}},{"type":"Feature","properties":{"ward_no":14},"geometry":{"type":"Polygon","coordinates":[[[76.0227,11.7399],[76.0237,11.7361],[76.0199,11.7335],[76.0108,11.733],[76.0102,11.735],[76.0061,11.7329],[76.0069,11.7309],[76.0035,11.7288],[76.0043,11.7249],[76.0078,11.723],[76.0083,11.7192],[76.0121,11.7233],[76.0156,11.7215],[76.0189,11.7226],[76.0173,11.7251],[76.0193,11.725],[76.0197,11.7235],[76.0238,11.7236],[76.0271,11.7263],[76.0265,11.7308],[76.0293,11.7355],[76.0258,11.7393],[76.0227,11.7399]]]}},{"type":"Feature","properties":{"ward_no":15},"geometry":{"type":"Polygon","coordinates":[[[76.004,11.7268],[76.0001,11.7274],[75.9975,11.7302],[75.9952,11.7247],[75.9903,11.7255],[75.9896,11.7223],[75.9916,11.7207],[75.9916,11.7185],[75.9882,11.7162],[75.9873,11.7134],[75.9965,11.7091],[75.9977,11.7117],[76.0003,11.7087],[76.0047,11.7152],[76.0034,11.7196],[76.0083,11.7192],[76.0078,11.7231],[76.0043,11.7249],[76.004,11.7268]]]}},{"type":"Feature","properties":{"ward_no":16},"geometry":{"type":"Polygon","coordinates":[[[75.9903,11.7255],[75.9933,11.724],[75.9963,11.7259],[75.996,11.7283],[75.9908,11.7305],[75.9914,11.7323],[75.9947,11.733],[75.9905,11.7353],[75.9844,11.7345],[75.9817,11.73],[75.9836,11.726],[75.9903,11.7255]]]}},{"type":"Feature","properties":{"ward_no":17},"geometry":{"type":"Polygon","coordinates":[[[75.9817,11.7259],[75.9765,11.7312],[75.9751,11.7263],[75.987,11.7138],[75.9916,11.7185],[75.9916,11.7207],[75.9896,11.7223],[75.9903,11.7255],[75.9817,11.7259]]]}},{"type":"Feature","properties":{"ward_no":18},"geometry":{"type":"Polygon","coordinates":[[[75.9908,11.7108],[75.9789,11.7217],[75.974,11.7164],[75.968,11.7172],[75.9693,11.7091],[75.9708,11.7074],[75.9732,11.7076],[75.9769,11.7018],[75.9788,11.7025],[75.9774,11.7054],[75.9848,11.7055],[75.9855,11.7077],[75.9882,11.7085],[75.9887,11.7115],[75.9908,11.7108]]]}},{"type":"Feature","properties":{"ward_no":19},"geometry":{"type":"Polygon","coordinates":[[[75.9708,11.7309],[75.9678,11.7323],[75.9659,11.7304],[75.9615,11.732],[75.9592,11.7306],[75.9599,11.7264],[75.9614,11.7256],[75.9589,11.7191],[75.9598,11.7144],[75.9678,11.7075],[75.9693,11.7091],[75.968,11.7172],[75.9743,11.7169],[75.9726,11.7196],[75.9741,11.7222],[75.9692,11.7259],[75.9732,11.7283],[75.9708,11.7309]]]}},{"type":"Feature","properties":{"ward_no":20},"geometry":{"type":"Polygon","coordinates":[[[75.9553,11.7309],[75.9549,11.7325],[75.9507,11.728],[75.9509,11.7231],[75.946,11.7226],[75.9458,11.7207],[75.9391,11.7172],[75.9455,11.7105],[75.9472,11.7101],[75.9489,11.7128],[75.9534,11.711],[75.9572,11.7148],[75.9567,11.7163],[75.9594,11.7176],[75.9614,11.7256],[75.9553,11.7309]]]}},{"type":"Feature","properties":{"ward_no":21},"geometry":{"type":"Polygon","coordinates":[[[75.9693,11.7091],[75.9675,11.7075],[75.9613,11.712],[75.9594,11.7176],[75.9567,11.7163],[75.9572,11.7148],[75.9534,11.711],[75.9489,11.7128],[75.9472,11.7101],[75.9455,11.7105],[75.9475,11.7048],[75.9533,11.7031],[75.9553,11.7045],[75.9552,11.7076],[75.9572,11.7094],[75.9598,11.7085],[75.9598,11.7045],[75.9623,11.7023],[75.9644,11.7038],[75.9674,11.7031],[75.9679,11.7052],[75.9703,11.7049],[75.9708,11.7074],[75.9693,11.7091]]]}},{"type":"Feature","properties":{"ward_no":22},"geometry":{"type":"Polygon","coordinates":[[[75.9533,11.7031],[75.9512,11.6999],[75.9528,11.6972],[75.9518,11.6946],[75.9589,11.6891],[75.9626,11.6914],[75.9642,11.6979],[75.967,11.6991],[75.9674,11.7031],[75.9644,11.7038],[75.9623,11.7023],[75.9598,11.7045],[75.9599,11.7085],[75.9574,11.7095],[75.9533,11.7031]]]}},{"type":"Feature","properties":{"ward_no":23},"geometry":{"type":"Polygon","coordinates":[[[75.9518,11.6946],[75.9528,11.6972],[75.9512,11.6999],[75.9533,11.7031],[75.9475,11.7048],[75.9458,11.7102],[75.9428,11.7123],[75.9383,11.7119],[75.9308,11.7142],[75.9278,11.7142],[75.9128,11.7051],[75.9019,11.7039],[75.9001,11.6988],[75.8977,11.6984],[75.9008,11.6944],[75.9115,11.6891],[75.9216,11.6914],[75.9276,11.6877],[75.9436,11.6962],[75.9493,11.6965],[75.9518,11.6946]]]}},{"type":"Feature","properties":{"ward_no":24},"geometry":{"type":"Polygon","coordinates":[[[75.9019,11.7039],[75.913,11.7052],[75.9279,11.7142],[75.937,11.7128],[75.9399,11.7267],[75.9342,11.724],[75.9325,11.7259],[75.9337,11.7279],[75.9319,11.7281],[75.9313,11.731],[75.9265,11.7302],[75.9207,11.7259],[75.9197,11.7217],[75.9219,11.7181],[75.9164,11.7167],[75.9103,11.7231],[75.9086,11.7216],[75.9085,11.7185],[75.9048,11.7176],[75.9002,11.711],[75.9019,11.7039]]]}}]};

// ─── MAP PROJECTION (no D3 — pure math) ───────────────────────────────────────
const BOUNDS = { lng0:75.888, lng1:76.040, lat0:11.683, lat1:11.763 };

function project(lng, lat, W, H, pad=18) {
  const x = pad + (lng - BOUNDS.lng0) / (BOUNDS.lng1 - BOUNDS.lng0) * (W - 2*pad);
  const y = (H - pad) - (lat - BOUNDS.lat0) / (BOUNDS.lat1 - BOUNDS.lat0) * (H - 2*pad);
  return [x, y];
}
function unproject(sx, sy, W, H, pad=18) {
  const lng = BOUNDS.lng0 + (sx - pad) / (W - 2*pad) * (BOUNDS.lng1 - BOUNDS.lng0);
  const lat = BOUNDS.lat0 + (H - pad - sy) / (H - 2*pad) * (BOUNDS.lat1 - BOUNDS.lat0);
  return [parseFloat(lng.toFixed(5)), parseFloat(lat.toFixed(5))];
}

// Pre-compute paths at module level (static data)
const STD_W = 820, STD_H = 480;
const WARD_SVG_DATA = WARD_GEOJSON.features.map(f => {
  const ring = f.geometry.coordinates[0];
  const wn = f.properties.ward_no;
  const pts = ring.map(([lng, lat]) => project(lng, lat, STD_W, STD_H));
  const d = "M" + pts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z";
  const cx = pts.reduce((s,[x])=>s+x,0)/pts.length;
  const cy = pts.reduce((s,[,y])=>s+y,0)/pts.length;
  return { wardNo: wn, d, cx: cx.toFixed(1), cy: cy.toFixed(1) };
});

// ─── DATA ──────────────────────────────────────────────────────────────────────
const WARDS = [
  {n:1,name:"Kandathuvayal"},{n:2,name:"Vellamunda 10th Mile"},{n:3,name:"Pazhanjana"},
  {n:4,name:"Pulinjal"},{n:5,name:"Vellamunda 8/4"},{n:6,name:"Kattayad"},
  {n:7,name:"Kokkadavu"},{n:8,name:"Pariyaram Mukku"},{n:9,name:"Tharuvana"},
  {n:10,name:"Peechancode"},{n:11,name:"Karingari"},{n:12,name:"Kappumkunnu"},
  {n:13,name:"Kellur"},{n:14,name:"Kommayad"},{n:15,name:"Paliyana"},
  {n:16,name:"Mazhuvannur"},{n:17,name:"Pulikkadu"},{n:18,name:"Cherukara"},
  {n:19,name:"Ozhukkanmoola"},{n:20,name:"Maniyil"},{n:21,name:"Mothakkara"},
  {n:22,name:"Varambetta"},{n:23,name:"Narokkadavu"},{n:24,name:"Mangalasserymala"}
];

const MAP_PALETTE = [
  "#a8c8e0","#b8d4a8","#f0c898","#e8b0b0","#f0e098","#b8d8d0",
  "#d4b8d4","#c8d8b0","#e0c8b8","#b8c8e8","#d8e8b0","#f0d8b8",
];

const CATEGORIES = [
  {id:"infra",  label:"Infrastructure",         icon:"🏗️", color:"#2d6a4f"},
  {id:"agri",   label:"Agriculture & Livelihoods",icon:"🌾", color:"#606c38"},
  {id:"health", label:"Health & Welfare",        icon:"🏥", color:"#bc4749"},
  {id:"edu",    label:"Education & Children",    icon:"📚", color:"#4361ee"},
  {id:"women",  label:"Women & Gender",          icon:"👩", color:"#9b2226"},
  {id:"water",  label:"Water & Sanitation",      icon:"💧", color:"#0077b6"},
  {id:"elderly",label:"Elderly Care",            icon:"🧓", color:"#774936"},
  {id:"youth",  label:"Youth & Sports",          icon:"⚽", color:"#e76f51"},
];

const BENEFICIARY_OPTIONS = [
  "General Public","Farmers","Women","Children","Elderly",
  "BPL Households","SC Community","ST Community",
  "Persons with Disability","Youth","Dairy Farmers","Fisherfolk",
];

const WARD_DEFICIT = {
  1:{infra:72,hazard:35,pop:28,social:68,access:65,population:1820},
  2:{infra:45,hazard:28,pop:62,social:42,access:30,population:1650},
  3:{infra:38,hazard:22,pop:55,social:35,access:28,population:1710},
  4:{infra:58,hazard:42,pop:38,social:55,access:52,population:1580},
  5:{infra:30,hazard:30,pop:70,social:38,access:22,population:2100},
  6:{infra:42,hazard:55,pop:45,social:40,access:35,population:1620},
  7:{infra:65,hazard:62,pop:32,social:72,access:68,population:1480},
  8:{infra:55,hazard:38,pop:48,social:58,access:45,population:1750},
  9:{infra:48,hazard:45,pop:42,social:45,access:40,population:1690},
  10:{infra:60,hazard:72,pop:25,social:65,access:70,population:1520},
  11:{infra:50,hazard:40,pop:38,social:50,access:48,population:1610},
  12:{infra:35,hazard:30,pop:52,social:32,access:30,population:1850},
  13:{infra:70,hazard:68,pop:20,social:75,access:78,population:1350},
  14:{infra:55,hazard:35,pop:35,social:48,access:55,population:1580},
  15:{infra:78,hazard:75,pop:28,social:82,access:80,population:1420},
  16:{infra:52,hazard:42,pop:40,social:52,access:50,population:1670},
  17:{infra:68,hazard:60,pop:32,social:70,access:72,population:1490},
  18:{infra:75,hazard:80,pop:22,social:78,access:75,population:1380},
  19:{infra:60,hazard:48,pop:35,social:62,access:58,population:1550},
  20:{infra:48,hazard:35,pop:45,social:44,access:42,population:1700},
  21:{infra:72,hazard:65,pop:25,social:76,access:72,population:1440},
  22:{infra:80,hazard:70,pop:18,social:85,access:85,population:1310},
  23:{infra:82,hazard:55,pop:15,social:80,access:82,population:1290},
  24:{infra:75,hazard:45,pop:22,social:72,access:68,population:1420},
};

const GP_BALLOT = [
  {id:1,title:"Comprehensive Paddy Development",cost:6200000,cat:"agri",benef:"Farmers",votes:23,mal:"സമഗ്ര നെൽകൃഷി വികസനം"},
  {id:2,title:"Milk Subsidy for Dairy Farmers",cost:6000000,cat:"agri",benef:"Farmers",votes:22,mal:"ക്ഷീര കർഷക സബ്സിഡി"},
  {id:3,title:"She-Lodge Construction",cost:3000000,cat:"women",benef:"Women",votes:18,mal:"She-Lodge നിർമ്മാണം"},
  {id:4,title:"Dairy Fodder Subsidy",cost:2800000,cat:"agri",benef:"Farmers",votes:20,mal:"കാലിത്തീറ്റ സബ്സിഡി"},
  {id:5,title:"Town Renovation Programme",cost:2000000,cat:"infra",benef:"General",votes:15,mal:"ടൗൺ നവീകരണം"},
  {id:6,title:"Take-a-Break Vellamunda (Tourism)",cost:2000000,cat:"infra",benef:"General",votes:12,mal:"ടേക്ക് എ ബ്രേക്ക്"},
  {id:7,title:"Interactive Displays for Schools",cost:1500000,cat:"edu",benef:"Children",votes:18,mal:"സ്കൂൾ ഡിസ്പ്ലേ"},
  {id:8,title:"Mini Dairy Farm Modernization",cost:1400000,cat:"agri",benef:"Farmers",votes:14,mal:"ഡയറി ഫാം ആധുനീകരണം"},
  {id:9,title:"Pepper & Lime Distribution",cost:1100000,cat:"agri",benef:"Farmers",votes:14,mal:"കുരുമുളക്/നാരങ്ങ"},
  {id:10,title:"Shelter Home Construction",cost:1000000,cat:"infra",benef:"General",votes:9,mal:"ഷെൽട്ടർ ഹോം"},
  {id:11,title:"Women Marketing Centre",cost:1000000,cat:"women",benef:"Women",votes:10,mal:"വനിതാ മാർക്കറ്റിംഗ്"},
  {id:12,title:"Ayurveda Programme for Aged",cost:800000,cat:"elderly",benef:"Elderly",votes:8,mal:"വയോജന ആയുർവേദ"},
  {id:13,title:"Poultry Distribution (BPL)",cost:700000,cat:"agri",benef:"BPL",votes:7,mal:"കോഴി വിതരണം"},
  {id:14,title:"School Furniture Purchase",cost:667000,cat:"edu",benef:"Children",votes:7,mal:"സ്കൂൾ ഫർണിച്ചർ"},
  {id:15,title:"Vegetable Cultivation Subsidy",cost:500000,cat:"agri",benef:"Farmers",votes:8,mal:"പച്ചക്കറി കൃഷി"},
  {id:16,title:"Makaloppam Education Project",cost:500000,cat:"edu",benef:"Children",votes:6,mal:"മകളൊപ്പം"},
  {id:17,title:"Dialysis Centre Share",cost:500000,cat:"health",benef:"General",votes:5,mal:"ഡയാലിസിസ്"},
  {id:18,title:"FHC Renovation Works",cost:500000,cat:"health",benef:"General",votes:7,mal:"FHC നവീകരണം"},
  {id:19,title:"Jagratha Samithi (Women Protection)",cost:422400,cat:"women",benef:"Women",votes:8,mal:"ജാഗ്രതാ സമിതി"},
  {id:20,title:"Clean Childhood Programme",cost:325000,cat:"edu",benef:"Children",votes:5,mal:"ശുദ്ധ ബാല്യം"},
];

// Ward ballot templates — rotated per ward so every ward has 8 unique items
const WTPL = [
  {title:"Solar Street Lighting",cost:520000,cat:"infra"},
  {title:"Road Widening & Repair",cost:880000,cat:"infra"},
  {title:"Footpath Construction",cost:480000,cat:"infra"},
  {title:"Drainage Improvement",cost:720000,cat:"water"},
  {title:"Drinking Water Extension",cost:650000,cat:"water"},
  {title:"Anganwadi Upgrade",cost:380000,cat:"edu"},
  {title:"School Compound Wall",cost:890000,cat:"edu"},
  {title:"Health Sub-Centre Upgrade",cost:610000,cat:"health"},
  {title:"Ward Playground & Park",cost:720000,cat:"youth"},
  {title:"Public Hall Renovation",cost:950000,cat:"infra"},
  {title:"Bus Shelter Construction",cost:320000,cat:"infra"},
  {title:"Kudumbashree Activity Centre",cost:420000,cat:"women"},
  {title:"Flood Protection Wall",cost:1200000,cat:"water"},
  {title:"Retaining Wall",cost:680000,cat:"infra"},
  {title:"LED Street Light Cluster",cost:420000,cat:"infra"},
  {title:"Community Library",cost:580000,cat:"edu"},
  {title:"Outdoor Fitness Equipment",cost:450000,cat:"youth"},
  {title:"Tribal Hamlet Road Access",cost:760000,cat:"infra"},
  {title:"Well Recharge Pits",cost:180000,cat:"water"},
  {title:"Cultural Centre Renovation",cost:1050000,cat:"infra"},
  {title:"Smart Classroom Equipment",cost:540000,cat:"edu"},
  {title:"Borewell / Water Tank",cost:280000,cat:"water"},
  {title:"Crematorium Improvement",cost:850000,cat:"infra"},
  {title:"Bicycle / Walking Track",cost:560000,cat:"youth"},
];
function getWardBallot(wardNo) {
  const w = WARDS.find(x=>x.n===wardNo);
  if (!w) return [];
  const off = (wardNo * 7) % WTPL.length;
  return Array.from({length:8},(_,i)=>{
    const t = WTPL[(off+i)%WTPL.length];
    return {id:wardNo*100+i+1, title:`${t.title} — ${w.name}`, cost:t.cost+((wardNo%4)*30000), cat:t.cat};
  });
}

const FORUM_IDEAS_INIT = [
  {id:1,title:"Organic farming cooperative for Vellamunda",desc:"Establish a GP-level cooperative providing organic certification, seed banks, and marketing support. Many families depend on coffee and pepper — organic premium prices would boost income by 20-30%.",author:"Suresh K.",ward:3,cat:"agri",upvotes:34,downvotes:2,comments:[{author:"Meera V.",text:"Our Kudumbashree group in ward 9 is already doing small-scale organic. A GP cooperative would give us bargaining power.",ts:"2 days ago"},{author:"Thomas P.",text:"What about the transition period? Farmers need support for 2-3 years before organic certification kicks in.",ts:"1 day ago"}],ts:"4 days ago"},
  {id:2,title:"Community well recharge before monsoon",desc:"Each ward should construct 3-4 recharge pits near existing wells. Karingari and Kappumkunnu have severe water shortage in summer. Cost is minimal — ₹50,000 per pit using local labour.",author:"Ravi M.",ward:11,cat:"water",upvotes:28,downvotes:1,comments:[{author:"Lakshmi S.",text:"Ward 12 desperately needs this. Our wells went dry last April.",ts:"3 days ago"}],ts:"5 days ago"},
  {id:3,title:"Women's skill training centre with crèche",desc:"Many women want to learn tailoring, food processing and computer skills but have no childcare. A training centre with an attached crèche would help. Could partner with KILA or ITI.",author:"Bindu T.",ward:18,cat:"women",upvotes:42,downvotes:5,comments:[{author:"Sathi R.",text:"This is exactly what we discussed at the last ward sabha!",ts:"1 day ago"},{author:"Priya K.",text:"The ITI building in ward 5 has unused space.",ts:"12 hours ago"}],ts:"6 days ago"},
  {id:4,title:"Solar street lights — Kokkadavu to Tharuvana road",desc:"The 2km stretch from Kokkadavu junction to Tharuvana school has zero lighting. Students and elderly are at risk. Solar lights cost around ₹5L and save on electricity bills.",author:"Anil P.",ward:7,cat:"infra",upvotes:19,downvotes:0,comments:[],ts:"3 days ago"},
  {id:5,title:"Mobile health clinic for remote tribal hamlets",desc:"Paniya and Kuruma settlements in wards 15, 17, 21 must walk 5+ km to reach the FHC. A weekly mobile clinic with basic medicines and maternal checkups would save lives.",author:"Dr. Asha K.",ward:15,cat:"health",upvotes:51,downvotes:3,comments:[{author:"Kunju M.",text:"Pregnant women in Mothakkara settlement missed 40% of checkups last year because of distance.",ts:"2 days ago"}],ts:"7 days ago"},
  {id:6,title:"Outdoor gym equipment in ward parks",desc:"Youth in Vellamunda have nowhere to exercise. Installing outdoor gym equipment in existing public spaces in wards 1, 6, 10, 14, 22 would cost ₹3-4L per ward.",author:"Vishnu S.",ward:14,cat:"youth",upvotes:15,downvotes:8,comments:[{author:"Mary J.",text:"Can we include a walking track for elderly too?",ts:"5 hours ago"}],ts:"2 days ago"},
];

const WORKSHOP_EVENTS = [
  {id:1,month:"Sep–Oct 2026",type:"Ward Sabha",icon:"🏘️",color:"#2d6a4f",where:"All 24 Ward Community Halls",who:"Open to all ward residents",agenda:["Present annual plan overview","Collect household needs & new proposals","Discuss unresolved last-year issues","Elect ward-level PB facilitators"]},
  {id:2,month:"Nov 2026",type:"Oorukoottam (Tribal Assembly)",icon:"🏔️",color:"#774936",where:"Tribal settlements — Unnati Colonies",who:"ST community (Paniya, Kuruma)",agenda:["Discuss TSP-funded projects","Review tribal hamlet infrastructure gaps","Vote on ST sub-ballot proposals","Facilitated in Paniya/Kuruma languages"]},
  {id:3,month:"Nov 2026",type:"Women's Special Gram Sabha",icon:"👩‍👩‍👧",color:"#9b2226",where:"Vellamunda Panchayat Hall",who:"All women — crèche provided",agenda:["Review WCP-eligible projects","Kudumbashree NHG presentations","Gender budget analysis","Discuss safety & livelihood schemes"]},
  {id:4,month:"Nov–Dec 2026",type:"Technical Working Group",icon:"🔧",color:"#d4a843",where:"Block Office, Vellamunda",who:"Engineers, Agriculture Officer, Secretary",agenda:["Feasibility assessment of 47 proposals","Cost estimation review","Environmental impact screening","Legal compliance verification"]},
  {id:5,month:"Dec 2026",type:"Accessibility Workshop",icon:"♿",color:"#0077b6",where:"Panchayat Hall + Home visits",who:"Elderly, disabled, caregivers",agenda:["Simplified ballot for elderly & disabled","Sign language interpretation","Home visits for bedridden citizens","Paper ballot form distribution"]},
  {id:6,month:"Dec 2026–Jan 2027",type:"Pre-Ballot Deliberation",icon:"🗣️",color:"#4361ee",where:"School Auditoriums (ward-wise)",who:"All citizens",agenda:["Final ballot presentation & Q&A","MES explained in simple terms","Voter registration drive","Multilingual materials distributed"]},
  {id:7,month:"Jan 15 – Feb 15, 2027",type:"Approval Ballot Open",icon:"🗳️",color:"#2d6a4f",where:"Online + Akshaya Centres",who:"All Vellamunda GP voters",agenda:["Online portal live","Paper ballot at Panchayat office","WhatsApp OTP voting available","Dedicated slots for senior citizens"]},
  {id:8,month:"Feb 20, 2027",type:"Results Announcement",icon:"📊",color:"#1a3a2a",where:"Panchayat Auditorium (Live Streamed)",who:"Public",agenda:["MES-aggregated results declared","Standing Committee ratification","Winners integrated into Annual Plan","Process documentation published"]},
];

const READING_MATERIALS = [
  {title:"Kerala People's Plan Campaign — Citizen Guide",type:"PDF",icon:"📄",desc:"Complete guide to ward sabha procedures, citizen rights, and how to participate in the annual planning process.",lang:"Malayalam + English"},
  {title:"How to Read the Annual Development Report (ADR)",type:"PDF",icon:"📄",desc:"Step-by-step guide to understanding the Panchayat's project list, fund codes (SCP/TSP/General), and budget allocations.",lang:"Malayalam"},
  {title:"Method of Equal Shares — Plain Language Explainer",type:"Link",icon:"🔗",desc:"Non-technical explanation of why MES is fairer than majority-voting. Includes visual examples and case studies from other panchayats.",lang:"English"},
  {title:"Wayanad Vulnerability & Infrastructure Profile 2024",type:"PDF",icon:"📄",desc:"Ward-level data on flood risk, tribal populations, road conditions, and infrastructure gaps from KSDR and KSDMA.",lang:"English"},
  {title:"Your Rights as a PB Voter (Leaflet)",type:"PDF",icon:"📄",desc:"Simple one-page leaflet explaining what participatory budgeting means, how votes are counted, and what happens after voting.",lang:"Malayalam"},
  {title:"K-SMART Infrastructure Data Portal",type:"Link",icon:"🔗",desc:"Real-time ward-level infrastructure data: road conditions (R-TACK), water supply coverage, project completion status.",url:"https://ksmart.lsgkerala.gov.in",lang:"Online"},
];

const RESULTS_DATA = [
  {pool:"GP-Wide",projects:30,budget:294,color:"#2d6a4f"},
  {pool:"Ward Pools",projects:37,budget:294,color:"#2d6a4f"},
  {pool:"Water/Sanitation",projects:10,budget:105,color:"#0077b6"},
  {pool:"SC Sub-Ballot",projects:7,budget:26,color:"#9b2226"},
  {pool:"ST Oorukoottam",projects:33,budget:188,color:"#774936"},
  {pool:"Road Maintenance",projects:41,budget:214,color:"#d4a843"},
];

const PHASES = [
  {id:0,label:"Welcome",icon:BookOpen,short:"Learn"},
  {id:1,label:"GIS Map",icon:Layers,short:"Map"},
  {id:2,label:"Ideate",icon:Lightbulb,short:"Ideate"},
  {id:3,label:"Forum",icon:MessageCircle,short:"Forum"},
  {id:4,label:"Workshops",icon:Calendar,short:"Events"},
  {id:5,label:"Review",icon:ClipboardCheck,short:"Review"},
  {id:6,label:"Vote",icon:Vote,short:"Vote"},
  {id:7,label:"Results",icon:BarChart3,short:"Results"},
  {id:8,label:"Data & Insights",icon:Database,short:"Data"},
];

const fmt = (n) => n>=10000000?`₹${(n/10000000).toFixed(2)} Cr`:n>=100000?`₹${(n/100000).toFixed(1)} L`:`₹${n.toLocaleString("en-IN")}`;

// ─── AI DUPLICATE CHECK ────────────────────────────────────────────────────────
async function aiCheckDuplicate(title, desc, existing) {
  if (!title || existing.length===0) return {isDuplicate:false,similarity:0,similar:null};
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:150,
        messages:[{role:"user",content:`You are a deduplication AI for a participatory budgeting system. Check if the NEW PROPOSAL is substantively similar to any EXISTING PROPOSAL.

NEW: "${title}" — ${desc}

EXISTING:
${existing.slice(0,10).map((p,i)=>`${i+1}. "${p.title}"`).join("\n")}

Reply ONLY with valid JSON (no markdown):
{"isDuplicate":true/false,"similarity":0-100,"similar":"exact title of most similar, or null"}`}]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text||"{}";
    return JSON.parse(text.replace(/```json|```/g,"").trim());
  } catch { return {isDuplicate:false,similarity:0,similar:null}; }
}

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function SectionTitle({children,sub}) {
  return (
    <div style={{marginBottom:20}}>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#1a3a2a",margin:"0 0 5px"}}>{children}</h2>
      {sub&&<p style={{fontSize:13,color:"#8a8070",margin:0,lineHeight:1.5}}>{sub}</p>}
    </div>
  );
}
function Badge({children,color="#2d6a4f"}) {
  return <span style={{background:color,color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:12,fontWeight:600,display:"inline-block"}}>{children}</span>;
}
function CatBadge({catId,size="sm"}) {
  const c = CATEGORIES.find(x=>x.id===catId);
  if (!c) return null;
  const fs = size==="lg"?13:10;
  return <span style={{background:`${c.color}18`,color:c.color,fontSize:fs,padding:size==="lg"?"5px 12px":"2px 8px",borderRadius:10,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4,border:`1px solid ${c.color}30`}}><span style={{fontSize:size==="lg"?16:13}}>{c.icon}</span>{c.label}</span>;
}

// ─── WARD MAP (pure SVG, no D3) ────────────────────────────────────────────────
function WardMap({selectedWard, onSelectWard, hoverWard, onHoverWard, pinMode=false, pins=[], onAddPin, highlightLayer=null, compact=false, showPng=false}) {
  const svgRef = useRef(null);
  const VW = STD_W, VH = STD_H;

  const getColor = useCallback((wardNo) => {
    if (selectedWard===wardNo) return "#1a3a2a";
    if (hoverWard===wardNo) return "#3a7a5a";
    if (highlightLayer) {
      const d = WARD_DEFICIT[wardNo];
      if (!d) return "#ccc";
      const score = highlightLayer==="infra"?d.infra:highlightLayer==="hazard"?d.hazard:highlightLayer==="social"?d.social:highlightLayer==="access"?d.access:Math.round((d.infra*0.3+d.hazard*0.2+d.social*0.25+d.access*0.15+d.pop*0.1));
      const t = score/100;
      return `rgb(${Math.round(255*t+240*(1-t))},${Math.round(100*t+230*(1-t))},${Math.round(90*t+210*(1-t))})`;
    }
    return MAP_PALETTE[(wardNo-1)%MAP_PALETTE.length];
  },[selectedWard,hoverWard,highlightLayer]);

  const handleClick = useCallback((e) => {
    if (!pinMode) return;
    const svg = svgRef.current; if(!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = (e.clientX-rect.left)*(VW/rect.width);
    const sy = (e.clientY-rect.top)*(VH/rect.height);
    const [lng,lat] = unproject(sx,sy,VW,VH);
    onAddPin?.({sx,sy,lng,lat});
  },[pinMode,VW,VH,onAddPin]);

  return (
    <div style={{position:"relative",background:"#eee8dc",borderRadius:12,overflow:"hidden",border:"1px solid #d8d0c4"}}>
      {showPng && (
        <div style={{position:"absolute",inset:0,zIndex:1}}>
          <img src="vellamunda_ward_map.png" alt="Vellamunda Ward Map" style={{width:"100%",height:"100%",objectFit:"contain",opacity:0.6}} />
        </div>
      )}
      <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} style={{width:"100%",display:"block",cursor:pinMode?"crosshair":"default",position:"relative",zIndex:2}} onClick={handleClick}>
        {/* Grid */}
        {[...Array(8)].map((_,i)=><line key={`h${i}`} x1={0} y1={VH*i/8} x2={VW} y2={VH*i/8} stroke="#d0c8b8" strokeWidth={0.5} strokeDasharray="4,4"/>)}
        {[...Array(12)].map((_,i)=><line key={`v${i}`} x1={VW*i/12} y1={0} x2={VW*i/12} y2={VH} stroke="#d0c8b8" strokeWidth={0.5} strokeDasharray="4,4"/>)}

        {/* Ward polygons */}
        {WARD_SVG_DATA.map(wp=>(
          <g key={wp.wardNo}>
            <path d={wp.d} fill={getColor(wp.wardNo)} stroke={selectedWard===wp.wardNo?"#1a3a2a":"#fff"} strokeWidth={selectedWard===wp.wardNo?2.5:1} style={{transition:"fill 0.2s"}}
              onMouseEnter={()=>onHoverWard?.(wp.wardNo)} onMouseLeave={()=>onHoverWard?.(null)}
              onClick={e=>{e.stopPropagation();!pinMode&&onSelectWard?.(wp.wardNo);}} cursor={pinMode?"crosshair":"pointer"} />
            {!compact&&(
              <>
                <circle cx={wp.cx} cy={wp.cy} r={11} fill={selectedWard===wp.wardNo?"#f0d78c20":"#1a3a2acc"}/>
                <text x={wp.cx} y={wp.cy} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="700" fill={selectedWard===wp.wardNo?"#f0d78c":"#fff"} style={{fontFamily:"sans-serif",pointerEvents:"none"}}>{wp.wardNo}</text>
              </>
            )}
          </g>
        ))}

        {/* Pins */}
        {pins.map((p,i)=>(
          <g key={i}>
            <circle cx={p.sx} cy={p.sy} r={9} fill="#bc4749" stroke="#fff" strokeWidth={2}/>
            <text x={p.sx} y={p.sy} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="#fff" style={{fontFamily:"sans-serif",pointerEvents:"none"}}>📍</text>
          </g>
        ))}

        {/* North arrow */}
        <g transform={`translate(${VW-32},26)`}>
          <polygon points="0,-12,-5,4,0,1,5,4" fill="#1a3a2a"/>
          <text y={14} textAnchor="middle" fontSize={9} fill="#1a3a2a" fontWeight="700" style={{fontFamily:"sans-serif"}}>N</text>
        </g>
      </svg>
    </div>
  );
}

// ─── PHASE 0: WELCOME ──────────────────────────────────────────────────────────
function WelcomePhase({onNext}) {
  return (
    <div>
      <div className="fade-up" style={{textAlign:"center",padding:"16px 0 24px"}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:32,color:"#1a3a2a",margin:"0 0 8px"}}>ജനകീയ ബജറ്റ് 2026-27</h1>
        <p style={{fontSize:15,color:"#6b6357",maxWidth:520,margin:"0 auto 20px",lineHeight:1.7}}>Vellamunda Grama Panchayat's AI-assisted Participatory Budgeting portal — where every ward's voice shapes the annual plan.</p>
        <button onClick={onNext} style={{background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)",color:"#fff",border:"none",padding:"13px 32px",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:8}}>
          Explore the Map <ArrowRight size={16}/>
        </button>
      </div>

      <div className="fade-up-d1" style={{marginBottom:28}}>
        <SectionTitle sub="A global movement that has reached Kerala's grassroots">What is Participatory Budgeting?</SectionTitle>
        <div className="card" style={{padding:"22px 26px"}}>
          <p style={{fontSize:14,lineHeight:1.8,color:"#3a3530",margin:"0 0 14px"}}>Participatory Budgeting (PB) is a democratic process where community members directly decide how to spend part of a public budget. Kerala's <strong>People's Plan Campaign (ജനകീയാസൂത്രണം)</strong> since 1996 pioneered grassroots planning through Ward Sabhas — but the critical step of <em>fairly aggregating citizen demands</em> remained opaque.</p>
          <div style={{background:"#f0ebe1",borderRadius:10,padding:"14px 18px",borderLeft:"4px solid #d4a843"}}>
            <p style={{fontSize:13,lineHeight:1.7,color:"#4a4540",margin:0}}><strong style={{color:"#1a3a2a"}}>Our proposal:</strong> Replace manual aggregation with the <strong>Method of Equal Shares (MES)</strong> — guaranteeing every citizen group proportional representation in the final budget. AI assists with deduplication and proposal classification on the admin side.</p>
          </div>
        </div>
      </div>

      <div className="stat-grid fade-up-d2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28}}>
        {[{n:"₹25.41 Cr",l:"Annual Plan Outlay",i:"💰"},{n:"24",l:"Wards",i:"🗺️"},{n:"40,627",l:"Population",i:"👥"},{n:"208",l:"Projects in ADR",i:"📋"}].map((s,i)=>(
          <div key={i} className="card" style={{padding:"18px 14px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:4}}>{s.i}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1a3a2a"}}>{s.n}</div>
            <div style={{fontSize:11,color:"#8a8070",marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* PB Process — compact 7 steps */}
      <div className="fade-up-d3">
        <SectionTitle sub="From Ward Sabha to implementation — seven phases">How the PB Process Works</SectionTitle>
        <div style={{display:"flex",gap:0,overflowX:"auto",paddingBottom:8}}>
          {[
            {n:1,i:"🏘️",t:"Ward Sabha",s:"Sep–Oct"},
            {n:2,i:"💡",t:"Idea Forum",s:"Oct–Nov"},
            {n:3,i:"👷",t:"Working Groups",s:"Nov–Dec"},
            {n:4,i:"🤝",t:"Deliberation",s:"Dec–Jan"},
            {n:5,i:"🗳️",t:"Ballot & Vote",s:"Jan–Feb"},
            {n:6,i:"📊",t:"MES Results",s:"Feb"},
            {n:7,i:"🚀",t:"Implementation",s:"Mar–"},
          ].map((s,i,arr)=>(
            <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
              <div className="card" style={{padding:"14px 12px",textAlign:"center",minWidth:110,borderRadius:10}}>
                <div style={{fontSize:22,marginBottom:5}}>{s.i}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#1a3a2a",marginBottom:3}}>{s.t}</div>
                <div style={{fontSize:10,color:"#a09888",fontWeight:600}}>{s.s}</div>
              </div>
              {i<arr.length-1&&<div style={{width:18,flexShrink:0,textAlign:"center",color:"#c8c0b0",fontSize:16}}>›</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PHASE 1: GIS MAP ──────────────────────────────────────────────────────────
function MapPhase() {
  const [selectedWard,setSelectedWard] = useState(null);
  const [hoverWard,setHoverWard] = useState(null);
  const [highlightLayer,setHighlightLayer] = useState(null);
  const [showPng,setShowPng] = useState(false);

  const ward = selectedWard?WARDS.find(w=>w.n===selectedWard):null;
  const d = selectedWard?WARD_DEFICIT[selectedWard]:null;
  const composite = d?Math.round(d.infra*0.3+d.hazard*0.2+d.social*0.25+d.access*0.15+d.pop*0.1):0;

  return (
    <div>
      <SectionTitle sub="24 ward boundaries from K-SMART delimitation. Click any ward to explore.">Ward Boundary & Vulnerability Map</SectionTitle>

      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:600,color:"#6b6357"}}>Overlay:</span>
        {[{id:null,l:"Ward colours"},{id:"infra",l:"🏗️ Infrastructure"},{id:"hazard",l:"⚠️ Hazard"},{id:"social",l:"👥 Social Vuln."},{id:"access",l:"🏥 Accessibility"}].map(l=>(
          <button key={String(l.id)} onClick={()=>setHighlightLayer(l.id)} style={{padding:"4px 12px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"inherit",background:highlightLayer===l.id?"#1a3a2a":"#fff",color:highlightLayer===l.id?"#f0d78c":"#4a4540",border:"1px solid "+(highlightLayer===l.id?"#1a3a2a":"#d8d0c4"),fontWeight:highlightLayer===l.id?700:400,transition:"all 0.2s"}}>{l.l}</button>
        ))}
        <button onClick={()=>setShowPng(!showPng)} style={{marginLeft:"auto",padding:"4px 12px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"inherit",background:showPng?"#d4a843":"#fff",color:showPng?"#fff":"#4a4540",border:"1px solid "+(showPng?"#d4a843":"#d8d0c4"),fontWeight:showPng?700:400}}>
          🖼️ PNG overlay
        </button>
      </div>

      <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
        <div style={{flex:2,minWidth:300}}>
          <WardMap selectedWard={selectedWard} onSelectWard={setSelectedWard} hoverWard={hoverWard} onHoverWard={setHoverWard} highlightLayer={highlightLayer} showPng={showPng}/>
          {hoverWard&&(
            <div style={{marginTop:6,padding:"6px 12px",background:"#1a3a2a",color:"#f0d78c",borderRadius:8,fontSize:12,display:"inline-flex",alignItems:"center",gap:8}}>
              <MapPin size={12}/> Ward {hoverWard} — {WARDS.find(w=>w.n===hoverWard)?.name}
            </div>
          )}
        </div>
        <div style={{flex:1,minWidth:250,display:"flex",flexDirection:"column",gap:12}}>
          {ward&&d?(
            <>
              <div className="card" style={{padding:"18px",background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)",color:"#fff"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:34,height:34,background:"rgba(240,215,140,0.2)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#f0d78c"}}>{ward.n}</div>
                  <div><div style={{fontSize:15,fontWeight:700,color:"#f0d78c"}}>{ward.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Pop: {d.population.toLocaleString("en-IN")}</div></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>Composite Deficit Index</span>
                  <span style={{fontSize:22,fontWeight:700,color:composite>60?"#ef4444":composite>40?"#fbbf24":"#4ade80"}}>{composite}</span>
                </div>
                <div style={{height:5,background:"rgba(255,255,255,0.2)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:`${composite}%`,height:"100%",background:composite>60?"#ef4444":composite>40?"#fbbf24":"#4ade80",transition:"width 0.5s"}}/>
                </div>
              </div>
              <div className="card" style={{padding:"16px"}}>
                <h4 style={{fontSize:13,fontWeight:700,color:"#1a3a2a",margin:"0 0 12px"}}>Deficit Breakdown</h4>
                {[{k:"infra",l:"🏗️ Infrastructure"},{k:"hazard",l:"⚠️ Hazard"},{k:"social",l:"👥 Social Vuln."},{k:"access",l:"🏥 Accessibility"},{k:"pop",l:"📈 Pop. Pressure"}].map(x=>(
                  <div key={x.k} style={{marginBottom:9}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                      <span style={{color:"#4a4540"}}>{x.l}</span>
                      <span style={{fontWeight:700,color:"#1a3a2a"}}>{d[x.k]}</span>
                    </div>
                    <div style={{height:4,background:"#f0ebe1",borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${d[x.k]}%`,height:"100%",background:d[x.k]>60?"#bc4749":d[x.k]>40?"#d4a843":"#2d6a4f",transition:"width 0.4s"}}/>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ):(
            <div className="card" style={{padding:"24px",textAlign:"center",background:"#faf8f4"}}>
              <div style={{fontSize:36,marginBottom:10}}>🗺️</div>
              <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:17,color:"#1a3a2a",margin:"0 0 8px"}}>Select a Ward</h3>
              <p style={{fontSize:13,color:"#8a8070",lineHeight:1.6,margin:0}}>Click any ward polygon to view its deficit profile, population, and indicators.</p>
              <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[{v:"High deficit",n:"Wards 15,18,22,23",c:"#ef4444"},{v:"Moderate",n:"Wards 7,10,13,17",c:"#f59e0b"},{v:"Lower deficit",n:"Wards 2,3,5,12",c:"#2d6a4f"},{v:"Central",n:"Wards 5,6,8,9",c:"#0077b6"}].map((g,i)=>(
                  <div key={i} style={{padding:"8px 10px",background:"#fff",borderRadius:8,borderLeft:`3px solid ${g.c}`}}>
                    <div style={{fontSize:11,fontWeight:700,color:g.c}}>{g.v}</div>
                    <div style={{fontSize:10,color:"#8a8070"}}>{g.n}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PHASE 2: IDEATE ───────────────────────────────────────────────────────────
function IdeatePhase() {
  const [form,setForm] = useState({title:"",desc:"",cat:"",ward:"",mobile:""});
  const [benef,setBenef] = useState([]);
  const [submitted,setSubmitted] = useState(false);
  const [dupState,setDupState] = useState({loading:false,result:null});
  const [showMapPin,setShowMapPin] = useState(false);
  const [pins,setPins] = useState([]);
  const [pinLoc,setPinLoc] = useState(null);
  const [showBenefDD,setShowBenefDD] = useState(false);

  const existingProposals = FORUM_IDEAS_INIT.map(p=>({title:p.title}));

  const handleDupCheck = async () => {
    if (!form.title) return;
    setDupState({loading:true,result:null});
    const result = await aiCheckDuplicate(form.title,form.desc,existingProposals);
    setDupState({loading:false,result});
  };

  const handleSubmit = async () => {
    if (!form.title||!form.desc||!form.ward||!form.mobile) return;
    if (!dupState.result) await handleDupCheck();
    setSubmitted(true);
    setTimeout(()=>{setSubmitted(false);setForm({title:"",desc:"",cat:"",ward:"",mobile:""});setBenef([]);setPins([]);setPinLoc(null);setDupState({loading:false,result:null});},5000);
  };

  const toggleBenef = (b) => setBenef(prev=>prev.includes(b)?prev.filter(x=>x!==b):[...prev,b]);

  const inp = (field,extra={}) => ({value:form[field],onChange:e=>setForm({...form,[field]:e.target.value}),style:{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:14,boxSizing:"border-box",fontFamily:"inherit",...(extra.style||{})}, ...extra});

  return (
    <div>
      <SectionTitle sub="AI checks for duplicate proposals at submission. Admin AI routes and categorises at the review stage.">Submit Your Proposal</SectionTitle>
      <div className="two-col" style={{display:"flex",gap:24,alignItems:"flex-start"}}>
        <div style={{flex:2}}>
          <div className="card fade-up" style={{padding:"26px"}}>
            {submitted&&(
              <div style={{background:"#2d6a4f",color:"#fff",padding:"12px 18px",borderRadius:10,marginBottom:18,display:"flex",alignItems:"center",gap:10}}>
                <Check size={18}/><div><div style={{fontWeight:600}}>Proposal submitted!</div><div style={{fontSize:12,opacity:0.8}}>Routed to Working Group for review.</div></div>
              </div>
            )}

            {/* Duplicate warning */}
            {dupState.result?.isDuplicate&&(
              <div style={{background:"#fef3c7",border:"1px solid #fbbf24",padding:"12px 16px",borderRadius:10,marginBottom:16,display:"flex",gap:10,alignItems:"start"}}>
                <AlertTriangle size={17} style={{color:"#f59e0b",flexShrink:0,marginTop:2}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#92400e"}}>⚠️ AI found a similar proposal ({dupState.result.similarity}% match)</div>
                  <div style={{fontSize:12,color:"#78350f",marginTop:2}}>Similar to: "{dupState.result.similar}" — consider merging or clearly differentiating your submission.</div>
                </div>
              </div>
            )}
            {dupState.result&&!dupState.result.isDuplicate&&(
              <div style={{background:"#f0fdf4",border:"1px solid #86efac",padding:"10px 16px",borderRadius:10,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                <Check size={16} style={{color:"#2d6a4f"}}/><span style={{fontSize:13,color:"#166534",fontWeight:600}}>No duplicate proposals found. Your idea looks unique!</span>
              </div>
            )}

            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:5}}>Project Title *</label>
              <input {...inp("title",{placeholder:"e.g., Solar street lights on Kandathuvayal main road"})}/>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:5}}>Description *</label>
              <textarea {...inp("desc",{placeholder:"Describe the problem, who it affects, and why this location needs this project.",rows:4,style:{resize:"vertical",lineHeight:1.6}})}/>
            </div>

            {/* AI Duplicate Check button - prominent */}
            <div style={{marginBottom:18,padding:"14px 16px",background:"#f5f0ff",borderRadius:10,border:"1px solid #ddd6fe"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#4c1d95"}}>✦ AI Duplicate Check</div>
                  <div style={{fontSize:11,color:"#7c3aed"}}>Checks your proposal against all existing submissions to prevent duplicates</div>
                </div>
                <button onClick={handleDupCheck} disabled={!form.title||dupState.loading} style={{background:"#7c3aed",color:"#fff",border:"none",padding:"8px 16px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,opacity:(!form.title||dupState.loading)?0.5:1,display:"flex",alignItems:"center",gap:6}}>
                  {dupState.loading?<><Activity size={13} className="spin"/>Checking…</>:<>Run Check</>}
                </button>
              </div>
            </div>

            <div style={{display:"flex",gap:14,marginBottom:16,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:150}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:5}}>Category</label>
                <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:14,fontFamily:"inherit",background:"#fff"}}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div style={{flex:1,minWidth:150}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:5}}>Your Ward *</label>
                <select value={form.ward} onChange={e=>setForm({...form,ward:e.target.value})} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:14,fontFamily:"inherit",background:"#fff"}}>
                  <option value="">Select ward</option>
                  {WARDS.map(w=><option key={w.n} value={w.n}>Ward {w.n} — {w.name}</option>)}
                </select>
              </div>
            </div>

            {/* Beneficiary multi-select */}
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:5}}>Who benefits? (select all that apply)</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {BENEFICIARY_OPTIONS.map(b=>{
                  const sel = benef.includes(b);
                  return (
                    <button key={b} onClick={()=>toggleBenef(b)} style={{padding:"5px 12px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"inherit",background:sel?"#1a3a2a":"#f0ebe1",color:sel?"#f0d78c":"#4a4540",border:"1px solid "+(sel?"#1a3a2a":"#d8d0c4"),fontWeight:sel?700:400,transition:"all 0.15s"}}>
                      {sel?"✓ ":""}{b}
                    </button>
                  );
                })}
              </div>
              {benef.length>0&&<div style={{fontSize:11,color:"#2d6a4f",marginTop:6}}>Selected: {benef.join(", ")}</div>}
            </div>

            {/* Mobile (required) */}
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:5}}>Mobile Number * <span style={{fontSize:11,color:"#bc4749"}}>(required for panchayat follow-up)</span></label>
              <input {...inp("mobile",{placeholder:"e.g., 9876543210",type:"tel"})}/>
            </div>

            {/* Map pin for location */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540"}}>📍 Pin proposal location on map</label>
                <button onClick={()=>setShowMapPin(!showMapPin)} style={{padding:"5px 12px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"inherit",background:showMapPin?"#1a3a2a":"#f0ebe1",color:showMapPin?"#f0d78c":"#4a4540",border:"1px solid "+(showMapPin?"#1a3a2a":"#d8d0c4")}}>
                  {showMapPin?"Close Map":"Open Map"}
                </button>
              </div>
              {pinLoc&&<div style={{fontSize:12,color:"#2d6a4f",background:"#f0f5f2",padding:"6px 12px",borderRadius:8,marginBottom:8}}>📌 Pinned: {pinLoc.lat}°N, {pinLoc.lng}°E</div>}
              {showMapPin&&(
                <div style={{border:"2px dashed #2d6a4f",borderRadius:12,overflow:"hidden"}}>
                  <div style={{padding:"7px 12px",background:"#f0f5f2",fontSize:12,color:"#2d6a4f",fontWeight:600}}>👆 Click on the map to drop a pin at your proposal location</div>
                  <WardMap compact selectedWard={form.ward?parseInt(form.ward):null} onSelectWard={n=>setForm({...form,ward:String(n)})} onHoverWard={()=>{}} pinMode pins={pins} onAddPin={({sx,sy,lng,lat})=>{setPins([{sx,sy}]);setPinLoc({lng,lat});}}/>
                </div>
              )}
            </div>

            <button onClick={handleSubmit} disabled={!form.title||!form.desc||!form.ward||!form.mobile} style={{background:"#2d6a4f",color:"#fff",border:"none",padding:"12px 26px",borderRadius:10,fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",opacity:(!form.title||!form.desc||!form.ward||!form.mobile)?0.5:1}}>
              <Send size={15}/> Submit Proposal
            </button>
          </div>
        </div>

        <div style={{flex:1,minWidth:220}}>
          <div className="card fade-up-d1" style={{padding:"20px",background:"#faf5ea",marginBottom:12}}>
            <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:17,color:"#1a3a2a",margin:"0 0 12px"}}>💡 Tips for a Strong Proposal</h3>
            {["Be specific about location — which road, school, or hamlet","Explain the problem and who suffers","Mention how many people benefit","Ideas can be ₹50K bus shelter or ₹30L cold storage — all welcome","All ideas vetted by Working Group for feasibility before ballot"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"start"}}>
                <Check size={13} style={{color:"#2d6a4f",flexShrink:0,marginTop:3}}/><span style={{fontSize:13,color:"#4a4540",lineHeight:1.5}}>{t}</span>
              </div>
            ))}
          </div>
          <div className="card fade-up-d2" style={{padding:"20px",background:"#f5f0ff"}}>
            <h3 style={{fontSize:13,fontWeight:700,color:"#4c1d95",margin:"0 0 10px"}}>🤖 How AI helps</h3>
            <div style={{fontSize:12,color:"#5b21b6",lineHeight:1.7}}>
              <div style={{marginBottom:6}}><strong>At submission:</strong> Duplicate check compares your title/description against all existing proposals and warns if something similar already exists.</div>
              <div><strong>At admin review:</strong> AI assists officials to auto-categorise, cluster related proposals, and route them to the correct Standing Committee — reducing manual effort across 200+ submissions.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PHASE 3: FORUM ────────────────────────────────────────────────────────────
function DiscussPhase() {
  const [ideas,setIdeas] = useState(FORUM_IDEAS_INIT);
  const [expandedId,setExpandedId] = useState(null);
  const [newComment,setNewComment] = useState({});
  const [filter,setFilter] = useState("all");
  const [sort,setSort] = useState("popular");

  const vote = (id,dir) => setIdeas(ideas.map(i=>i.id===id?{...i,upvotes:i.upvotes+(dir==="up"?1:0),downvotes:i.downvotes+(dir==="down"?1:0)}:i));
  const addComment = (id) => {
    if(!newComment[id]?.trim()) return;
    setIdeas(ideas.map(i=>i.id===id?{...i,comments:[...i.comments,{author:"You",text:newComment[id],ts:"Just now"}]}:i));
    setNewComment({...newComment,[id]:""});
  };

  let filtered = filter==="all"?ideas:ideas.filter(i=>i.cat===filter);
  if(sort==="popular") filtered=[...filtered].sort((a,b)=>(b.upvotes-b.downvotes)-(a.upvotes-a.downvotes));
  if(sort==="recent") filtered=[...filtered].sort((a,b)=>b.id-a.id);
  if(sort==="discussed") filtered=[...filtered].sort((a,b)=>b.comments.length-a.comments.length);

  return (
    <div>
      <SectionTitle sub="Read, discuss, and support ideas from fellow citizens. Most-supported ideas inform the ballot.">Community Forum</SectionTitle>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:3,background:"#fff",borderRadius:8,padding:3,border:"1px solid #e0d8c8",flexWrap:"wrap"}}>
          {[{v:"all",l:"All"},...CATEGORIES.map(c=>({v:c.id,l:`${c.icon} ${c.label}`}))].map(f=>(
            <button key={f.v} onClick={()=>setFilter(f.v)} style={{padding:"5px 10px",borderRadius:6,border:"none",fontSize:11,cursor:"pointer",background:filter===f.v?"#2d6a4f":"transparent",color:filter===f.v?"#fff":"#6b6357",fontWeight:filter===f.v?600:400,fontFamily:"inherit",whiteSpace:"nowrap"}}>{f.l}</button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #e0d8c8",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
          <option value="popular">Most Supported</option>
          <option value="recent">Most Recent</option>
          <option value="discussed">Most Discussed</option>
        </select>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(idea=>{
          const expanded=expandedId===idea.id;
          const cat = CATEGORIES.find(c=>c.id===idea.cat);
          return (
            <div key={idea.id} className="card" style={{padding:"18px 20px"}}>
              <div style={{display:"flex",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:42}}>
                  <button onClick={()=>vote(idea.id,"up")} style={{background:"none",border:"none",cursor:"pointer",padding:3,color:"#2d6a4f"}}><ThumbsUp size={17}/></button>
                  <span style={{fontWeight:700,fontSize:16,color:"#1a3a2a"}}>{idea.upvotes-idea.downvotes}</span>
                  <button onClick={()=>vote(idea.id,"down")} style={{background:"none",border:"none",cursor:"pointer",padding:3,color:"#bc4749"}}><ThumbsDown size={17}/></button>
                </div>
                <div style={{flex:1}}>
                  {/* Category badge - prominent */}
                  {cat&&<div style={{marginBottom:8}}><CatBadge catId={idea.cat} size="lg"/></div>}
                  <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 6px",lineHeight:1.3}}>{idea.title}</h3>
                  <p style={{fontSize:13,color:"#5a5550",lineHeight:1.7,margin:"0 0 10px"}}>{idea.desc}</p>
                  <div style={{display:"flex",gap:14,alignItems:"center",fontSize:12,color:"#8a8070",flexWrap:"wrap"}}>
                    <span style={{fontWeight:600,color:"#4a4540"}}>{idea.author}</span>
                    <span>Ward {idea.ward}</span>
                    <span>{idea.ts}</span>
                    <button onClick={()=>setExpandedId(expanded?null:idea.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#2d6a4f",fontWeight:600,fontSize:12,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>
                      <MessageCircle size={13}/> {idea.comments.length} {expanded?<ChevronDown size={13}/>:<ChevronRight size={13}/>}
                    </button>
                  </div>
                  {expanded&&(
                    <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #ebe5d8"}}>
                      {idea.comments.map((c,ci)=>(
                        <div key={ci} style={{padding:"9px 12px",background:"#faf8f2",borderRadius:8,marginBottom:7}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:600,color:"#1a3a2a"}}>{c.author}</span><span style={{fontSize:11,color:"#a09888"}}>{c.ts}</span></div>
                          <p style={{fontSize:13,color:"#4a4540",margin:0,lineHeight:1.6}}>{c.text}</p>
                        </div>
                      ))}
                      <div style={{display:"flex",gap:8,marginTop:8}}>
                        <input value={newComment[idea.id]||""} onChange={e=>setNewComment({...newComment,[idea.id]:e.target.value})} onKeyDown={e=>e.key==="Enter"&&addComment(idea.id)} placeholder="Add a comment…" style={{flex:1,padding:"8px 12px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:13,fontFamily:"inherit"}}/>
                        <button onClick={()=>addComment(idea.id)} style={{background:"#2d6a4f",color:"#fff",border:"none",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Post</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PHASE 4: WORKSHOPS ────────────────────────────────────────────────────────
function DeliberatePhase() {
  const [activeSection,setActiveSection] = useState("events");

  return (
    <div>
      <SectionTitle sub="Offline and hybrid sessions ensuring all citizens — including those without internet — can participate.">Workshops & Participation</SectionTitle>

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{v:"events",l:"📅 Schedule"},{v:"reading",l:"📚 Reading Materials"}].map(t=>(
          <button key={t.v} onClick={()=>setActiveSection(t.v)} style={{padding:"8px 18px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:"inherit",background:activeSection===t.v?"#1a3a2a":"#fff",color:activeSection===t.v?"#f0d78c":"#4a4540",border:"1px solid "+(activeSection===t.v?"#1a3a2a":"#e0d8c8"),fontWeight:activeSection===t.v?700:400}}>{t.l}</button>
        ))}
      </div>

      {activeSection==="events"&&(
        <div className="fade-up">
          <div className="card" style={{padding:"20px 24px",marginBottom:16,background:"linear-gradient(135deg,#faf5ea,#f5efe2)",borderLeft:"5px solid #d4a843"}}>
            <p style={{fontSize:13,color:"#4a4540",lineHeight:1.8,margin:0}}>In Vellamunda — a tribal-majority GP in Wayanad — digital access is uneven. The PB process is <strong>hybrid</strong>: online for connected citizens, structured offline workshops for all others. Kerala's <strong>Ward Sabha</strong> and <strong>Oorukoottam (ഊരുകൂട്ടം)</strong> mechanisms provide the institutional framework.</p>
          </div>

          {/* Simple vertical timeline */}
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {WORKSHOP_EVENTS.map((evt,i)=>(
              <div key={evt.id} style={{display:"flex",gap:0}}>
                {/* Timeline spine */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:48,flexShrink:0}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:evt.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,border:"3px solid #fff",boxShadow:"0 0 0 2px "+evt.color+"40"}}>{evt.icon}</div>
                  {i<WORKSHOP_EVENTS.length-1&&<div style={{width:2,flex:1,background:evt.color+"40",minHeight:24,margin:"4px 0"}}/>}
                </div>
                {/* Content */}
                <div style={{flex:1,paddingLeft:14,paddingBottom:i<WORKSHOP_EVENTS.length-1?20:0}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:15,fontWeight:700,color:"#1a3a2a"}}>{evt.type}</span>
                    <span style={{fontSize:11,fontWeight:600,background:evt.color+"18",color:evt.color,padding:"2px 10px",borderRadius:10,border:`1px solid ${evt.color}30`}}>{evt.month}</span>
                  </div>
                  <div style={{fontSize:12,color:"#6b6357",marginBottom:6}}>
                    <span style={{marginRight:12}}>📍 {evt.where}</span>
                    <span>👤 {evt.who}</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {evt.agenda.map((a,j)=>(
                      <span key={j} style={{fontSize:12,color:"#4a4540",background:"#faf8f2",padding:"3px 10px",borderRadius:6,border:"1px solid #ebe5d8"}}>• {a}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Accessibility */}
          <div className="card" style={{padding:"20px",background:"#f0f5f2",marginTop:20}}>
            <h3 style={{fontSize:14,fontWeight:700,color:"#2d6a4f",margin:"0 0 10px"}}>🌍 Inclusion & Accessibility</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
              {["Akshaya CSC centres in every ward for digital ballot","Multilingual facilitators: Malayalam, Paniya, Kuruma","Paper ballot option at Panchayat office","Transport from remote ST/SC settlements","Childcare at all deliberation events","Home visits for bedridden citizens"].map((f,i)=>(
                <div key={i} style={{display:"flex",gap:7,alignItems:"start"}}>
                  <Check size={14} style={{color:"#2d6a4f",flexShrink:0,marginTop:2}}/><span style={{fontSize:12,color:"#4a4540",lineHeight:1.5}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection==="reading"&&(
        <div className="fade-up">
          <div style={{background:"#f0ebe1",borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#4a4540",lineHeight:1.7}}>
            These resources help citizens make <strong>informed decisions</strong> before the ballot. Read through them to understand the annual development plan, the voting process, and your ward's needs.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {READING_MATERIALS.map((r,i)=>(
              <div key={i} className="card" style={{padding:"18px 22px",display:"flex",gap:16,alignItems:"start"}}>
                <div style={{fontSize:28,flexShrink:0}}>{r.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                    <h3 style={{fontSize:14,fontWeight:700,color:"#1a3a2a",margin:0}}>{r.title}</h3>
                    <span style={{fontSize:10,fontWeight:700,background:r.type==="PDF"?"#fef3c7":"#e0f2fe",color:r.type==="PDF"?"#92400e":"#0369a1",padding:"2px 8px",borderRadius:6}}>{r.type}</span>
                    <span style={{fontSize:10,color:"#8a8070",background:"#f0ebe1",padding:"2px 8px",borderRadius:6}}>{r.lang}</span>
                  </div>
                  <p style={{fontSize:13,color:"#5a5550",lineHeight:1.6,margin:"0 0 8px"}}>{r.desc}</p>
                  <a href={r.url||"#"} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#2d6a4f",fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,textDecoration:"none"}}>
                    {r.type==="PDF"?<FileText size={13}/>:<ExternalLink size={13}/>}
                    {r.type==="PDF"?"Download PDF":"Open Link"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PHASE 5: REVIEW ───────────────────────────────────────────────────────────
function DevelopPhase() {
  const pipeline = [
    {stage:"Submitted",count:47,color:"#a09888",desc:"Raw citizen ideas from forum and ward sabhas"},
    {stage:"AI-Screened",count:44,color:"#7c3aed",desc:"AI duplicate check removed 3 near-identical proposals",ai:true},
    {stage:"Reviewed",count:38,color:"#d4a843",desc:"Working Group: feasibility, legality, overlap assessed"},
    {stage:"Costed",count:32,color:"#e76f51",desc:"AE / Agriculture Officer prepared cost estimates"},
    {stage:"Ballot-Ready",count:28,color:"#2d6a4f",desc:"Final proposals approved for citizen ballot"},
  ];
  return (
    <div>
      <SectionTitle sub="AI pre-screens for duplicates. Working Groups verify feasibility, cost, and legal compliance.">Expert Vetting & Proposal Pipeline</SectionTitle>
      <div className="card fade-up" style={{padding:"26px",marginBottom:18}}>
        <h3 style={{fontSize:14,fontWeight:700,color:"#1a3a2a",margin:"0 0 16px"}}>Proposal Pipeline</h3>
        {pipeline.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <div style={{width:120,fontSize:12,fontWeight:600,color:s.color,textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4}}>
              {s.ai&&<span style={{fontSize:9,background:"#7c3aed20",color:"#7c3aed",padding:"2px 5px",borderRadius:4,fontWeight:700}}>✦ AI</span>}
              {s.stage}
            </div>
            <div style={{flex:1,position:"relative",height:32,background:"#f0ebe1",borderRadius:8,overflow:"hidden"}}>
              <div style={{width:`${(s.count/47)*100}%`,height:"100%",background:s.color,borderRadius:8,display:"flex",alignItems:"center",paddingLeft:10,transition:"width 0.6s ease"}}>
                <span style={{color:"#fff",fontSize:13,fontWeight:700}}>{s.count}</span>
              </div>
            </div>
            <div style={{width:220,fontSize:12,color:"#6b6357"}}>{s.desc}</div>
          </div>
        ))}
      </div>
      <div className="fade-up-d1" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
        {[
          {t:"Technical Feasibility",i:"🔧",who:"Assistant Engineer",checks:["Engineering assessment","Site inspection done","Materials availability","Environmental review"],c:"#d4a843"},
          {t:"Financial Viability",i:"💰",who:"Accounts Officer",checks:["Cost estimation ready","Budget source confirmed (Gen/SCP/TSP)","No duplication with existing","Multi-year check done"],c:"#2d6a4f"},
          {t:"Legal & Policy",i:"⚖️",who:"Secretary",checks:["Kerala PRIs Act compliant","No land encroachment","Permits obtainable","XV FC norms met"],c:"#0077b6"},
          {t:"AI Classification",i:"✦",who:"Admin AI (Claude)",checks:["Auto-categorise by content","Cluster related proposals","Route to correct committee","Flag for merge/split"],c:"#7c3aed"},
        ].map((v,i)=>(
          <div key={i} className="card" style={{padding:"18px",borderTop:`3px solid ${v.c}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:20}}>{v.i}</span>
              <div><div style={{fontSize:13,fontWeight:700,color:"#1a3a2a"}}>{v.t}</div><div style={{fontSize:11,color:"#8a8070"}}>{v.who}</div></div>
            </div>
            {v.checks.map((c,ci)=>(
              <div key={ci} style={{display:"flex",gap:7,alignItems:"center",marginBottom:5}}>
                <Check size={13} style={{color:v.c,flexShrink:0}}/><span style={{fontSize:12,color:"#4a4540"}}>{c}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PHASE 6: VOTE ─────────────────────────────────────────────────────────────
function VotePhase() {
  const [ward,setWard] = useState(null);
  const [gpVotes,setGpVotes] = useState(new Set());
  const [wardVotes,setWardVotes] = useState(new Set());
  const [submitted,setSubmitted] = useState(false);
  const MAX_GP=8, MAX_WARD=4;

  const toggleGp = id => { const n=new Set(gpVotes);n.has(id)?n.delete(id):n.size<MAX_GP&&n.add(id);setGpVotes(n); };
  const toggleWard = id => { const n=new Set(wardVotes);n.has(id)?n.delete(id):n.size<MAX_WARD&&n.add(id);setWardVotes(n); };
  const gpCost = [...gpVotes].reduce((s,id)=>s+(GP_BALLOT.find(x=>x.id===id)?.cost||0),0);
  const wardItems = ward ? getWardBallot(ward) : [];
  const wardCost = [...wardVotes].reduce((s,id)=>s+(wardItems.find(x=>x.id===id)?.cost||0),0);

  if (submitted) return (
    <div><SectionTitle>Ballot Submitted!</SectionTitle>
      <div className="card fade-up" style={{padding:"48px 32px",textAlign:"center"}}>
        <div style={{fontSize:60,marginBottom:14}}>🗳️</div>
        <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"#2d6a4f",margin:"0 0 10px"}}>Thank you for voting!</h3>
        <p style={{fontSize:14,color:"#6b6357",maxWidth:400,margin:"0 auto 20px",lineHeight:1.7}}>Your ballot is recorded. You approved <strong>{gpVotes.size} GP-wide</strong> and <strong>{wardVotes.size} ward-level</strong> projects. Results will be calculated using the <strong>Method of Equal Shares</strong>.</p>
        <button onClick={()=>{setSubmitted(false);setGpVotes(new Set());setWardVotes(new Set());setWard(null);}} style={{background:"#2d6a4f",color:"#fff",border:"none",padding:"10px 24px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View Results →</button>
      </div>
    </div>
  );

  return (
    <div>
      <SectionTitle sub="Approval ballot — tick ALL projects you support. No ranking needed.">Cast Your Vote</SectionTitle>
      {!ward?(
        <div className="card fade-up" style={{padding:"28px",textAlign:"center"}}>
          <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:19,color:"#1a3a2a",margin:"0 0 10px"}}>🗺️ Select Your Ward to Begin</h3>
          <p style={{fontSize:13,color:"#6b6357",marginBottom:18}}>You will vote on GP-wide projects (all voters) <strong>and</strong> ward-specific projects (your ward only).</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:7,maxWidth:720,margin:"0 auto"}}>
            {WARDS.map(w=>(
              <button key={w.n} onClick={()=>setWard(w.n)} style={{padding:"9px 8px",border:"1px solid #d8d0c4",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:12,fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}}>
                <span style={{background:"#2d6a4f",color:"#fff",borderRadius:6,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{w.n}</span>
                <span style={{lineHeight:1.3}}>{w.name}</span>
              </button>
            ))}
          </div>
        </div>
      ):(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <Badge color="#2d6a4f">Ward {ward} — {WARDS.find(w=>w.n===ward)?.name}</Badge>
            <button onClick={()=>{setWard(null);setWardVotes(new Set());}} style={{background:"none",border:"1px solid #d8d0c4",padding:"5px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit",color:"#6b6357"}}>Change Ward</button>
          </div>

          {/* GP Ballot */}
          <div className="fade-up" style={{marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:17,color:"#1a3a2a",margin:0}}>🏛️ GP-Wide Projects <span style={{fontSize:12,fontWeight:400,color:"#8a8070"}}>(vote for any you support, up to {MAX_GP})</span></h3>
              <span style={{fontSize:13,fontWeight:600,color:gpVotes.size>=MAX_GP?"#bc4749":"#2d6a4f"}}>{gpVotes.size}/{MAX_GP}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {GP_BALLOT.map(p=>{const sel=gpVotes.has(p.id);return(
                <button key={p.id} onClick={()=>toggleGp(p.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:sel?"#e8f5e9":"#fff",border:sel?"2px solid #2d6a4f":"1px solid #e0d8c8",borderRadius:10,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s"}}>
                  <div style={{width:20,height:20,borderRadius:5,border:sel?"2px solid #2d6a4f":"2px solid #c8c0b0",background:sel?"#2d6a4f":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel&&<Check size={13} color="#fff"/>}</div>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#1a3a2a"}}>{p.title}</div><div style={{fontSize:11,color:"#8a8070",marginTop:2}}>{p.benef} • {p.mal}</div></div>
                  <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:12,fontWeight:700,color:"#1a3a2a"}}>{fmt(p.cost)}</div><CatBadge catId={p.cat}/></div>
                </button>
              );})}
            </div>
          </div>

          {/* Ward Ballot */}
          <div className="fade-up-d1" style={{marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:17,color:"#1a3a2a",margin:0}}>📍 Ward {ward} Projects <span style={{fontSize:12,fontWeight:400,color:"#8a8070"}}>(up to {MAX_WARD})</span></h3>
              <span style={{fontSize:13,fontWeight:600,color:wardVotes.size>=MAX_WARD?"#bc4749":"#0077b6"}}>{wardVotes.size}/{MAX_WARD}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {wardItems.map(p=>{const sel=wardVotes.has(p.id);return(
                <button key={p.id} onClick={()=>toggleWard(p.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:sel?"#e3f2fd":"#fff",border:sel?"2px solid #0077b6":"1px solid #e0d8c8",borderRadius:10,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s"}}>
                  <div style={{width:20,height:20,borderRadius:5,border:sel?"2px solid #0077b6":"2px solid #c8c0b0",background:sel?"#0077b6":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel&&<Check size={13} color="#fff"/>}</div>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#1a3a2a"}}>{p.title}</div></div>
                  <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:12,fontWeight:700,color:"#1a3a2a"}}>{fmt(p.cost)}</div><CatBadge catId={p.cat}/></div>
                </button>
              );})}
            </div>
          </div>

          {(gpVotes.size>0||wardVotes.size>0)&&(
            <div className="card" style={{padding:"16px 22px",position:"sticky",bottom:12,boxShadow:"0 -2px 16px rgba(0,0,0,0.1)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><span style={{fontSize:14,fontWeight:600,color:"#1a3a2a"}}>{gpVotes.size+wardVotes.size} projects selected</span><span style={{fontSize:12,color:"#8a8070",marginLeft:10}}>GP: {fmt(gpCost)} · Ward: {fmt(wardCost)}</span></div>
                <button onClick={()=>setSubmitted(true)} style={{background:"#2d6a4f",color:"#fff",border:"none",padding:"11px 28px",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>Submit Ballot <Send size={15}/></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PHASE 7: RESULTS ──────────────────────────────────────────────────────────
function ResultsPhase() {
  return (
    <div>
      <SectionTitle sub="How citizen votes are aggregated using the Method of Equal Shares.">Budget Allocation Results</SectionTitle>

      {/* MES Info card */}
      <div className="card fade-up" style={{padding:"24px 28px",marginBottom:20,background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)",color:"#fff"}}>
        <div style={{display:"flex",gap:12,alignItems:"start",marginBottom:14}}>
          <div style={{fontSize:32}}>⚖️</div>
          <div>
            <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#f0d78c",margin:"0 0 4px"}}>Method of Equal Shares (MES)</h3>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.75)",margin:0}}>The voting rule used to produce the final budget allocation.</p>
          </div>
        </div>
        <p style={{fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,0.9)",margin:"0 0 16px"}}>
          In traditional majority voting, the most popular projects win — and minority communities (tribal hamlets, elderly groups, small wards) are systematically ignored. MES fixes this.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          {[
            {i:"👥",t:"Equal budget share",d:"Every voter receives an equal ₹ share of the pool. A project is funded when its supporters can collectively 'afford' it from their shares."},
            {i:"🏘️",t:"Ward equity built-in",d:"The 24-ward sub-pool architecture guarantees every ward receives funding — regardless of which voting rule is applied."},
            {i:"🛡️",t:"Minority protection",d:"Small cohesive groups — tribal communities, elderly, women — are guaranteed proportional representation. No group is systematically left out."},
            {i:"📐",t:"Mathematically fair",d:"MES satisfies Extended Justified Representation (EJR) — a rigorous fairness criterion proven in academic literature."},
          ].map((p,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"14px",border:"1px solid rgba(255,255,255,0.15)"}}>
              <div style={{fontSize:22,marginBottom:6}}>{p.i}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#f0d78c",marginBottom:4}}>{p.t}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pool results table */}
      <div className="card fade-up-d1" style={{padding:"22px",marginBottom:18}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 16px"}}>Results by Ballot Pool</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {RESULTS_DATA.map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:140,fontSize:13,fontWeight:600,color:"#1a3a2a",textAlign:"right"}}>{r.pool}</div>
              <div style={{flex:1,position:"relative",height:30,background:"#f0ebe1",borderRadius:8,overflow:"hidden"}}>
                <div style={{width:`${(r.projects/51)*100}%`,height:"100%",background:r.color,borderRadius:8,display:"flex",alignItems:"center",paddingLeft:10}}>
                  <span style={{color:"#fff",fontSize:12,fontWeight:700}}>{r.projects} projects</span>
                </div>
              </div>
              <div style={{width:80,fontSize:13,fontWeight:600,color:"#2d6a4f",textAlign:"right"}}>₹{r.budget}L</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fairness highlights */}
      <div className="card fade-up-d2" style={{padding:"20px"}}>
        <h3 style={{fontSize:14,fontWeight:700,color:"#1a3a2a",margin:"0 0 14px"}}>✅ Fairness Outcomes</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:10}}>
          {[
            {i:"🏘️",t:"All 24 wards funded",d:"The ward sub-pool architecture guarantees structural equity — every ward receives a proportionate share."},
            {i:"👩",t:"WCP floor met naturally",d:"MES selections satisfy the 10% Women Component Plan floor (₹81.6L) without requiring explicit enforcement."},
            {i:"🏔️",t:"ST community protected",d:"Oorukoottam sub-ballot ensures tribal hamlets' preferred projects are funded through a dedicated TSP pool."},
            {i:"💧",t:"Water earmark enforced",d:"The XV Finance Commission tied grant (₹1.05 Cr) runs as a separate ballot — the earmark is the pool boundary."},
          ].map((p,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"start",padding:"12px",background:"#faf8f2",borderRadius:10}}>
              <span style={{fontSize:22,flexShrink:0}}>{p.i}</span>
              <div><div style={{fontSize:13,fontWeight:700,color:"#1a3a2a",marginBottom:3}}>{p.t}</div><div style={{fontSize:12,color:"#5a5550",lineHeight:1.5}}>{p.d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PHASE 8: DATA & INSIGHTS ──────────────────────────────────────────────────
function DataPhase() {
  const [activeTab,setActiveTab] = useState("deficit");
  const [weights,setWeights] = useState({infra:30,hazard:20,pop:10,social:25,access:15});
  const [highlightLayer,setHighlightLayer] = useState(null);
  const [selectedWard,setSelectedWard] = useState(null);

  const TOTAL_WARD_BUDGET = 29400000;
  const BASE_SHARE = 0.40;

  const allocations = (() => {
    const scores = Object.entries(WARD_DEFICIT).map(([wn,d])=>{
      const comp = d.infra*(weights.infra/100)+d.hazard*(weights.hazard/100)+d.pop*(weights.pop/100)+d.social*(weights.social/100)+d.access*(weights.access/100);
      return {wardNo:parseInt(wn),comp,name:WARDS.find(w=>w.n===parseInt(wn))?.name||""};
    });
    const total = scores.reduce((s,x)=>s+x.comp,0);
    const base = (TOTAL_WARD_BUDGET*BASE_SHARE)/24;
    const needPool = TOTAL_WARD_BUDGET*(1-BASE_SHARE);
    const equal = TOTAL_WARD_BUDGET/24;
    return scores.map(s=>({...s,base,need:(s.comp/total)*needPool,total:base+(s.comp/total)*needPool,equal})).sort((a,b)=>b.total-a.total);
  })();

  const adjustW = (key,delta) => {
    const curr=weights[key]; const nv=Math.max(0,Math.min(70,curr+delta)); const diff=nv-curr;
    const others=Object.keys(weights).filter(k=>k!==key);
    const tot=others.reduce((s,k)=>s+weights[k],0);
    if(tot===0&&diff<0) return;
    const nw={...weights,[key]:nv};
    let rem=100-nv; if(rem<0)rem=0;
    const ratio=tot>0?rem/tot:0;
    others.forEach(k=>{ nw[k]=Math.max(0,Math.round(weights[k]*ratio)); });
    const s=Object.values(nw).reduce((a,b)=>a+b,0); if(s!==100) nw[others[others.length-1]]+=(100-s);
    setWeights(nw);
  };

  const newsItems = [
    {title:"Kerala Economic Review 2025 — Wayanad priorities",src:"Kerala State Planning Board",tag:"Macro Context",d:"Wayanad remains among Kerala's three most vulnerable districts. Post-2018 flood recovery is ongoing; infrastructure deficit in tribal taluks estimated 40% above state average.",c:"#d4a843"},
    {title:"MES academic literature — Lackner & Peters (2023)",src:"Economic Computation Conference",tag:"Voting Theory",d:"EJR guarantee is mathematically proven for MES with approval ballots. Extended Justified Representation ensures no cohesive group of k voters is systematically ignored.",c:"#4361ee"},
    {title:"K-SMART Panchayat Data Portal — Vellamunda 2024-25",src:"LSGD Kerala / K-SMART",tag:"Local Data",d:"Road condition scores (R-TACK), infrastructure gap indices, and ward-level project histories available. 38 of 208 projects from 2023-24 show completion delays.",c:"#2d6a4f"},
    {title:"TSP fund utilisation gap — Vellamunda GP",src:"ST Development Department, Kerala",tag:"Equity",d:"Vellamunda GP's Tribal Sub-Plan utilisation was 71% in 2023-24 — below the 90% target. Identifying beneficiaries in remote hamlets is the main bottleneck.",c:"#774936"},
    {title:"PB and welfare outcomes — meta-analysis",src:"Wampler, Goldfrank & Touchton (2021)",tag:"Evidence",d:"120 PB programs show 23% higher infrastructure reach in previously-excluded communities vs non-PB comparators. Strongest effect in rural/tribal settings.",c:"#0077b6"},
  ];

  return (
    <div>
      <SectionTitle sub="Ward deficit indices, deficit-based fund allocation with adjustable weights, and contextual evidence.">Data & Insights</SectionTitle>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {[{v:"deficit",l:"📊 Deficit Index"},{v:"allocation",l:"💰 Fund Allocation"},{v:"news",l:"📰 Evidence & Data"}].map(t=>(
          <button key={t.v} onClick={()=>setActiveTab(t.v)} style={{padding:"8px 18px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:"inherit",background:activeTab===t.v?"#1a3a2a":"#fff",color:activeTab===t.v?"#f0d78c":"#4a4540",border:"1px solid "+(activeTab===t.v?"#1a3a2a":"#e0d8c8"),fontWeight:activeTab===t.v?700:400,transition:"all 0.2s"}}>{t.l}</button>
        ))}
      </div>

      {activeTab==="deficit"&&(
        <div>
          <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:18}}>
            <div style={{flex:2,minWidth:280}}>
              <div className="card fade-up" style={{padding:"14px"}}>
                <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                  {[{id:null,l:"Ward colours"},{id:"infra",l:"🏗️ Infra"},{id:"hazard",l:"⚠️ Hazard"},{id:"social",l:"👥 Social"},{id:"access",l:"🏥 Access"}].map(l=>(
                    <button key={String(l.id)} onClick={()=>setHighlightLayer(l.id)} style={{padding:"3px 10px",borderRadius:12,fontSize:11,cursor:"pointer",fontFamily:"inherit",background:highlightLayer===l.id?"#1a3a2a":"#f0ebe1",color:highlightLayer===l.id?"#f0d78c":"#4a4540",border:"none",fontWeight:highlightLayer===l.id?700:400}}>{l.l}</button>
                  ))}
                </div>
                <WardMap selectedWard={selectedWard} onSelectWard={setSelectedWard} onHoverWard={()=>{}} highlightLayer={highlightLayer} compact/>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,fontSize:11,color:"#8a8070"}}>
                  <span>Low deficit</span>
                  <div style={{flex:1,height:5,background:"linear-gradient(90deg,#f0e6d0,#ff6464)",borderRadius:4}}/>
                  <span>High deficit</span>
                </div>
              </div>
            </div>
            <div style={{flex:1,minWidth:230}}>
              <div className="card fade-up-d1" style={{padding:"18px"}}>
                <h3 style={{fontSize:13,fontWeight:700,color:"#1a3a2a",margin:"0 0 12px"}}>🔴 Highest Deficit Wards</h3>
                {Object.entries(WARD_DEFICIT).map(([wn,d])=>({wn:parseInt(wn),score:Math.round(d.infra*0.3+d.hazard*0.2+d.social*0.25+d.access*0.15+d.pop*0.1)})).sort((a,b)=>b.score-a.score).slice(0,8).map((item,i)=>(
                  <div key={item.wn} style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#8a8070",width:14}}>{i+1}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                        <span style={{fontSize:12,fontWeight:600,color:"#1a3a2a"}}>W{item.wn} {WARDS.find(w=>w.n===item.wn)?.name}</span>
                        <span style={{fontSize:12,fontWeight:700,color:item.score>65?"#bc4749":"#d4a843"}}>{item.score}</span>
                      </div>
                      <div style={{height:3,background:"#f0ebe1",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${item.score}%`,height:"100%",background:item.score>65?"#bc4749":"#d4a843"}}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab==="allocation"&&(
        <div>
          <div style={{display:"flex",gap:18,marginBottom:18,flexWrap:"wrap"}}>
            <div className="card fade-up" style={{flex:1,minWidth:260,padding:"22px"}}>
              <h3 style={{fontSize:14,fontWeight:700,color:"#1a3a2a",margin:"0 0 5px"}}>⚖️ Adjust Allocation Weights</h3>
              <p style={{fontSize:12,color:"#8a8070",margin:"0 0 16px",lineHeight:1.5}}>Weights determine how the need-based 60% of ward funds is distributed. Every ward gets an equal 40% base share regardless.</p>
              {[{key:"infra",label:"Infrastructure Deficit",color:"#2d6a4f",icon:"🏗️"},{key:"hazard",label:"Hazard Exposure",color:"#bc4749",icon:"⚠️"},{key:"pop",label:"Population Pressure",color:"#0077b6",icon:"📈"},{key:"social",label:"Social Vulnerability",color:"#9b2226",icon:"👥"},{key:"access",label:"Accessibility Deficit",color:"#d4a843",icon:"🏥"}].map(w=>(
                <div key={w.key} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <span style={{fontSize:12,color:"#4a4540",fontWeight:600}}>{w.icon} {w.label}</span>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <button onClick={()=>adjustW(w.key,-5)} style={{width:22,height:22,borderRadius:4,border:"1px solid #d8d0c4",background:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,lineHeight:1}}>−</button>
                      <span style={{fontSize:13,fontWeight:700,color:w.color,width:30,textAlign:"center"}}>{weights[w.key]}%</span>
                      <button onClick={()=>adjustW(w.key,5)} style={{width:22,height:22,borderRadius:4,border:"1px solid #d8d0c4",background:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,lineHeight:1}}>+</button>
                    </div>
                  </div>
                  <div style={{height:5,background:"#f0ebe1",borderRadius:4,overflow:"hidden"}}>
                    <div style={{width:`${weights[w.key]}%`,height:"100%",background:w.color,transition:"width 0.3s"}}/>
                  </div>
                </div>
              ))}
              <div style={{padding:"10px",background:"#f0f5f2",borderRadius:8,fontSize:12,color:"#2d6a4f",fontWeight:600,textAlign:"center"}}>Total: {Object.values(weights).reduce((s,v)=>s+v,0)}% ✓</div>
            </div>

            <div className="card fade-up-d1" style={{flex:2,minWidth:300,padding:"22px"}}>
              <h3 style={{fontSize:14,fontWeight:700,color:"#1a3a2a",margin:"0 0 4px"}}>Resulting Allocation (Top 12 wards by need)</h3>
              <p style={{fontSize:11,color:"#8a8070",margin:"0 0 14px"}}>Red bars exceed equal share; green bars are at or below.</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={allocations.slice(0,12)} margin={{top:5,right:10,left:0,bottom:40}}>
                  <XAxis dataKey="wardNo" tickFormatter={v=>`W${v}`} tick={{fontSize:10,fill:"#6b6357"}} angle={-40} textAnchor="end" height={50}/>
                  <YAxis tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`} tick={{fontSize:10,fill:"#6b6357"}}/>
                  <Tooltip formatter={(val)=>[fmt(val),"Allocation"]} labelFormatter={l=>`Ward ${l}`} contentStyle={{borderRadius:8,fontSize:12}}/>
                  <Bar dataKey="total" radius={[4,4,0,0]}>
                    {allocations.slice(0,12).map((a,i)=>(
                      <Cell key={i} fill={a.total>a.equal*1.25?"#bc4749":a.total>a.equal*1.1?"#d4a843":"#2d6a4f"}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card fade-up-d2" style={{padding:"18px",overflowX:"auto"}}>
            <h3 style={{fontSize:13,fontWeight:700,color:"#1a3a2a",margin:"0 0 12px"}}>Allocation: Equal Share vs Deficit-Based (Top 10)</h3>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"2px solid #e0d8c8"}}>
                  {["Ward","Name","Deficit Score","Equal Share","Deficit-Based","Difference"].map(h=>(
                    <th key={h} style={{padding:"7px 10px",textAlign:"left",color:"#6b6357",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allocations.slice(0,10).map((a,i)=>(
                  <tr key={a.wardNo} style={{borderBottom:"1px solid #f0ebe1",background:i%2?"#faf8f4":"#fff"}}>
                    <td style={{padding:"7px 10px",fontWeight:700,color:"#1a3a2a"}}>{a.wardNo}</td>
                    <td style={{padding:"7px 10px",color:"#3a3530"}}>{a.name}</td>
                    <td style={{padding:"7px 10px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:36,height:5,background:"#f0ebe1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${a.comp}%`,height:"100%",background:a.comp>60?"#bc4749":"#d4a843"}}/></div>
                        <span style={{fontWeight:700,color:a.comp>60?"#bc4749":"#d4a843"}}>{a.comp.toFixed(0)}</span>
                      </div>
                    </td>
                    <td style={{padding:"7px 10px",color:"#6b6357"}}>{fmt(a.equal)}</td>
                    <td style={{padding:"7px 10px",fontWeight:600,color:"#1a3a2a"}}>{fmt(a.total)}</td>
                    <td style={{padding:"7px 10px",fontWeight:700,color:a.total>a.equal?"#2d6a4f":"#bc4749"}}>{a.total>a.equal?"+":""}{fmt(a.total-a.equal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab==="news"&&(
        <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:12}}>
          {newsItems.map((n,i)=>(
            <div key={i} className="card" style={{padding:"18px 22px",borderLeft:`4px solid ${n.c}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:7,gap:10,flexWrap:"wrap"}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#1a3a2a",margin:0,flex:1}}>{n.title}</h3>
                <span style={{background:`${n.c}18`,color:n.c,fontSize:11,padding:"2px 10px",borderRadius:10,fontWeight:700,flexShrink:0,border:`1px solid ${n.c}30`}}>{n.tag}</span>
              </div>
              <p style={{fontSize:13,color:"#5a5550",lineHeight:1.7,margin:"0 0 8px"}}>{n.d}</p>
              <div style={{fontSize:11,color:"#a09888"}}>{n.src}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [phase,setPhase] = useState(0);
  const [animIn,setAnimIn] = useState(true);

  const switchPhase = p => {
    setAnimIn(false);
    setTimeout(()=>{setPhase(p);setAnimIn(true);},150);
  };

  const PhaseComps = [WelcomePhase,MapPhase,IdeatePhase,DiscussPhase,DeliberatePhase,DevelopPhase,VotePhase,ResultsPhase,DataPhase];
  const PhaseComp = PhaseComps[phase];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(175deg,#f0ebe1 0%,#e8e2d6 40%,#f5f0e6 100%)",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1a1a1a"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=DM+Serif+Display&display=swap" rel="stylesheet"/>

      <header style={{background:"linear-gradient(135deg,#1a3a2a,#2d6a4f 60%,#40916c)",padding:"13px 20px 10px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,0.15)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
            <div>
              <h1 style={{fontFamily:"'DM Serif Display',serif",color:"#f0d78c",fontSize:19,margin:0,letterSpacing:0.5}}>ജനകീയാസൂത്രണം</h1>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:10,margin:"2px 0 0",letterSpacing:0.8}}>VELLAMUNDA GRAMA PANCHAYAT • PARTICIPATORY BUDGETING 2026-27</p>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["24 WARDS","₹25.41 Cr","✦ AI-Assisted"].map(t=>(
                <span key={t} style={{background:"rgba(255,255,255,0.13)",color:"#f0d78c",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:2,overflowX:"auto",paddingBottom:2}}>
            {PHASES.map((p,i)=>{const Icon=p.icon;const active=phase===i;return(
              <button key={i} onClick={()=>switchPhase(i)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 11px",background:active?"rgba(255,255,255,0.2)":"transparent",border:active?"1px solid rgba(240,215,140,0.4)":"1px solid transparent",borderRadius:8,color:active?"#f0d78c":"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:11,fontWeight:active?700:500,transition:"all 0.2s",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"}}>
                <Icon size={13}/><span className="phase-label">{p.short}</span>
              </button>
            );})}
          </div>
        </div>
      </header>

      <main style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px 60px",opacity:animIn?1:0,transform:animIn?"translateY(0)":"translateY(8px)",transition:"all 0.2s ease"}}>
        <PhaseComp onNext={()=>switchPhase(1)}/>
      </main>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.4s ease both}
        .fade-up-d1{animation:fadeUp 0.4s ease 0.08s both}
        .fade-up-d2{animation:fadeUp 0.4s ease 0.16s both}
        .fade-up-d3{animation:fadeUp 0.4s ease 0.24s both}
        .card{background:#fff;border-radius:14px;border:1px solid #e0d8c8;box-shadow:0 1px 4px rgba(0,0,0,0.04)}
        .card:hover{box-shadow:0 3px 12px rgba(0,0,0,0.07)}
        button:hover{filter:brightness(1.04)}
        input:focus,textarea:focus,select:focus{outline:none;border-color:#2d6a4f!important;box-shadow:0 0 0 3px rgba(45,106,79,0.12)}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-thumb{background:#c8c0b0;border-radius:3px}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .spin{animation:spin 0.9s linear infinite}
        @media(max-width:640px){.phase-label{display:none}.two-col{flex-direction:column!important}.stat-grid{grid-template-columns:1fr 1fr!important}}
      `}</style>
    </div>
  );
}
