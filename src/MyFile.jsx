import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, CartesianGrid
} from "recharts";
import {
  ChevronRight, ChevronDown, ThumbsUp, ThumbsDown, MessageCircle, Send,
  Check, AlertCircle, Vote, Users, Lightbulb, ClipboardCheck, BarChart3,
  BookOpen, MapPin, Calendar, Star, Filter, Search, ArrowRight, Info,
  Heart, Eye, X, Plus, Minus, Layers, Zap, Database, Navigation,
  AlertTriangle, TrendingUp, Activity, Globe
} from "lucide-react";

// ─── EMBEDDED GEOJSON (simplified, ~9KB) ──────────────────────────────────────
const WARD_GEOJSON = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"ward_no":2},"geometry":{"type":"Polygon","coordinates":[[[75.9331,11.7401],[75.9283,11.7405],[75.9257,11.7376],[75.9304,11.736],[75.9329,11.7328],[75.9319,11.7281],[75.9337,11.7279],[75.9325,11.7259],[75.9347,11.724],[75.9399,11.7267],[75.9377,11.7305],[75.9386,11.732],[75.9331,11.7401]]]}},{"type":"Feature","properties":{"ward_no":3},"geometry":{"type":"Polygon","coordinates":[[[75.9487,11.7413],[75.9519,11.7432],[75.9514,11.7449],[75.9469,11.7438],[75.9445,11.7411],[75.942,11.7428],[75.9344,11.7424],[75.9328,11.7407],[75.939,11.7319],[75.946,11.7339],[75.9485,11.7331],[75.9449,11.7402],[75.9479,11.7399],[75.9487,11.7413]]]}},{"type":"Feature","properties":{"ward_no":4},"geometry":{"type":"Polygon","coordinates":[[[75.9485,11.7331],[75.946,11.7339],[75.9379,11.7312],[75.9406,11.7251],[75.9381,11.7202],[75.9373,11.7121],[75.9428,11.7123],[75.9391,11.7172],[75.9458,11.7207],[75.9468,11.7263],[75.9497,11.7298],[75.9485,11.7331]]]}},{"type":"Feature","properties":{"ward_no":5},"geometry":{"type":"Polygon","coordinates":[[[75.9562,11.7442],[75.9527,11.7467],[75.9519,11.7432],[75.9491,11.7425],[75.9481,11.74],[75.9449,11.7402],[75.9497,11.7298],[75.9468,11.7263],[75.9463,11.7226],[75.9509,11.7231],[75.9507,11.728],[75.9549,11.7325],[75.9599,11.7264],[75.9599,11.7318],[75.9572,11.734],[75.9586,11.7353],[75.9552,11.7359],[75.9548,11.7416],[75.9562,11.7442]]]}},{"type":"Feature","properties":{"ward_no":6},"geometry":{"type":"Polygon","coordinates":[[[75.966,11.7556],[75.958,11.7519],[75.9582,11.7499],[75.9559,11.7468],[75.957,11.7452],[75.9548,11.7416],[75.9552,11.7359],[75.9586,11.7354],[75.9572,11.734],[75.959,11.7322],[75.9644,11.7304],[75.9676,11.732],[75.9701,11.7374],[75.9686,11.7542],[75.966,11.7556]]]}},{"type":"Feature","properties":{"ward_no":1},"geometry":{"type":"Polygon","coordinates":[[[75.9261,11.7392],[75.9187,11.7411],[75.9121,11.7381],[75.9094,11.7322],[75.9086,11.7216],[75.9114,11.723],[75.9106,11.7214],[75.9163,11.7167],[75.9219,11.718],[75.9197,11.7223],[75.9215,11.727],[75.9265,11.7302],[75.9317,11.7304],[75.933,11.7325],[75.9304,11.736],[75.9263,11.7366],[75.9261,11.7392]]]}},{"type":"Feature","properties":{"ward_no":7},"geometry":{"type":"Polygon","coordinates":[[[75.969,11.753],[75.9697,11.738],[75.9746,11.7376],[75.9766,11.7387],[75.9767,11.741],[75.9819,11.7426],[75.9843,11.7453],[75.9827,11.7473],[75.9842,11.749],[75.9832,11.751],[75.9824,11.7476],[75.9811,11.7473],[75.9754,11.752],[75.969,11.753]]]}},{"type":"Feature","properties":{"ward_no":8},"geometry":{"type":"Polygon","coordinates":[[[75.9819,11.7319],[75.9799,11.7337],[75.9813,11.7369],[75.9777,11.7386],[75.9727,11.7369],[75.9701,11.7379],[75.968,11.7352],[75.9678,11.7323],[75.9732,11.7283],[75.9692,11.7259],[75.9741,11.7222],[75.9726,11.7196],[75.9743,11.7169],[75.9789,11.7219],[75.9765,11.724],[75.9749,11.7289],[75.9776,11.7309],[75.9811,11.7261],[75.9836,11.726],[75.9819,11.7319]]]}},{"type":"Feature","properties":{"ward_no":9},"geometry":{"type":"Polygon","coordinates":[[[75.9856,11.7462],[75.9819,11.7426],[75.9767,11.741],[75.9766,11.7387],[75.9813,11.7369],[75.9799,11.7337],[75.9819,11.7319],[75.9863,11.735],[75.9858,11.7364],[75.9937,11.7412],[75.9873,11.7437],[75.9881,11.7453],[75.9856,11.7462]]]}},{"type":"Feature","properties":{"ward_no":10},"geometry":{"type":"Polygon","coordinates":[[[76.0119,11.7529],[76.0102,11.7515],[76.0076,11.7523],[75.9993,11.7497],[75.9969,11.7515],[75.9864,11.7531],[75.9832,11.7517],[75.9842,11.749],[75.9827,11.7473],[75.9873,11.746],[75.9873,11.7437],[75.9937,11.7412],[76.0012,11.7468],[76.0005,11.7427],[76.0022,11.7425],[76.0041,11.743],[76.0046,11.7474],[76.0071,11.7472],[76.0077,11.7491],[76.0093,11.746],[76.0129,11.7461],[76.0119,11.7529]]]}},{"type":"Feature","properties":{"ward_no":11},"geometry":{"type":"Polygon","coordinates":[[[76.0008,11.7417],[76.0016,11.7466],[76.0005,11.7469],[75.9955,11.7417],[75.9858,11.7364],[75.9863,11.735],[75.987,11.734],[75.9906,11.7353],[75.9946,11.733],[75.9906,11.7318],[75.9915,11.7294],[75.9966,11.7283],[75.9975,11.7302],[76.0001,11.7274],[76.004,11.7268],[76.0035,11.7289],[76.0069,11.7309],[76.0064,11.7333],[76.0008,11.7417]]]}},{"type":"Feature","properties":{"ward_no":12},"geometry":{"type":"Polygon","coordinates":[[[76.0129,11.7461],[76.0093,11.746],[76.0077,11.7491],[76.0071,11.7472],[76.0046,11.7474],[76.0041,11.743],[76.0005,11.7427],[76.0054,11.7353],[76.0048,11.7341],[76.008,11.7334],[76.0102,11.735],[76.0108,11.7331],[76.0166,11.7325],[76.0227,11.7351],[76.0237,11.7379],[76.0219,11.7414],[76.0193,11.7381],[76.0172,11.7393],[76.017,11.7414],[76.014,11.7397],[76.0153,11.7439],[76.0129,11.7447],[76.0129,11.7461]]]}},{"type":"Feature","properties":{"ward_no":13},"geometry":{"type":"Polygon","coordinates":[[[76.0211,11.7411],[76.0163,11.7449],[76.015,11.7486],[76.0234,11.7548],[76.0207,11.7557],[76.0208,11.7584],[76.0176,11.7576],[76.0177,11.7597],[76.0152,11.7578],[76.0134,11.7586],[76.0129,11.7447],[76.0153,11.7439],[76.0139,11.7399],[76.017,11.7414],[76.0172,11.7393],[76.0193,11.7381],[76.0211,11.7411]]]}},{"type":"Feature","properties":{"ward_no":14},"geometry":{"type":"Polygon","coordinates":[[[76.0227,11.7399],[76.0237,11.7361],[76.0199,11.7335],[76.0108,11.733],[76.0102,11.735],[76.0061,11.7329],[76.0069,11.7309],[76.0035,11.7288],[76.0043,11.7249],[76.0078,11.723],[76.0083,11.7192],[76.0121,11.7233],[76.0156,11.7215],[76.0189,11.7226],[76.0173,11.7251],[76.0193,11.725],[76.0197,11.7235],[76.0238,11.7236],[76.0271,11.7263],[76.0265,11.7308],[76.0293,11.7355],[76.0258,11.7393],[76.0227,11.7399]]]}},{"type":"Feature","properties":{"ward_no":15},"geometry":{"type":"Polygon","coordinates":[[[76.004,11.7268],[76.0001,11.7274],[75.9975,11.7302],[75.9952,11.7247],[75.9903,11.7255],[75.9896,11.7223],[75.9916,11.7207],[75.9916,11.7185],[75.9882,11.7162],[75.9873,11.7134],[75.9965,11.7091],[75.9977,11.7117],[76.0003,11.7087],[76.0047,11.7152],[76.0034,11.7196],[76.0083,11.7192],[76.0078,11.7231],[76.0043,11.7249],[76.004,11.7268]]]}},{"type":"Feature","properties":{"ward_no":16},"geometry":{"type":"Polygon","coordinates":[[[75.9903,11.7255],[75.9933,11.724],[75.9963,11.7259],[75.996,11.7283],[75.9908,11.7305],[75.9914,11.7323],[75.9947,11.733],[75.9905,11.7353],[75.9844,11.7345],[75.9817,11.73],[75.9836,11.726],[75.9903,11.7255]]]}},{"type":"Feature","properties":{"ward_no":17},"geometry":{"type":"Polygon","coordinates":[[[75.9817,11.7259],[75.9765,11.7312],[75.9751,11.7263],[75.987,11.7138],[75.9916,11.7185],[75.9916,11.7207],[75.9896,11.7223],[75.9903,11.7255],[75.9817,11.7259]]]}},{"type":"Feature","properties":{"ward_no":18},"geometry":{"type":"Polygon","coordinates":[[[75.9908,11.7108],[75.9789,11.7217],[75.974,11.7164],[75.968,11.7172],[75.9693,11.7091],[75.9708,11.7074],[75.9732,11.7076],[75.9769,11.7018],[75.9788,11.7025],[75.9774,11.7054],[75.9848,11.7055],[75.9855,11.7077],[75.9882,11.7085],[75.9887,11.7115],[75.9908,11.7108]]]}},{"type":"Feature","properties":{"ward_no":19},"geometry":{"type":"Polygon","coordinates":[[[75.9708,11.7309],[75.9678,11.7323],[75.9659,11.7304],[75.9615,11.732],[75.9592,11.7306],[75.9599,11.7264],[75.9614,11.7256],[75.9589,11.7191],[75.9598,11.7144],[75.9678,11.7075],[75.9693,11.7091],[75.968,11.7172],[75.9743,11.7169],[75.9726,11.7196],[75.9741,11.7222],[75.9692,11.7259],[75.9732,11.7283],[75.9708,11.7309]]]}},{"type":"Feature","properties":{"ward_no":20},"geometry":{"type":"Polygon","coordinates":[[[75.9553,11.7309],[75.9549,11.7325],[75.9507,11.728],[75.9509,11.7231],[75.946,11.7226],[75.9458,11.7207],[75.9391,11.7172],[75.9455,11.7105],[75.9472,11.7101],[75.9489,11.7128],[75.9534,11.711],[75.9572,11.7148],[75.9567,11.7163],[75.9594,11.7176],[75.9614,11.7256],[75.9553,11.7309]]]}},{"type":"Feature","properties":{"ward_no":21},"geometry":{"type":"Polygon","coordinates":[[[75.9693,11.7091],[75.9675,11.7075],[75.9613,11.712],[75.9594,11.7176],[75.9567,11.7163],[75.9572,11.7148],[75.9534,11.711],[75.9489,11.7128],[75.9472,11.7101],[75.9455,11.7105],[75.9475,11.7048],[75.9533,11.7031],[75.9553,11.7045],[75.9552,11.7076],[75.9572,11.7094],[75.9598,11.7085],[75.9598,11.7045],[75.9623,11.7023],[75.9644,11.7038],[75.9674,11.7031],[75.9679,11.7052],[75.9703,11.7049],[75.9708,11.7074],[75.9693,11.7091]]]}},{"type":"Feature","properties":{"ward_no":22},"geometry":{"type":"Polygon","coordinates":[[[75.9533,11.7031],[75.9512,11.6999],[75.9528,11.6972],[75.9518,11.6946],[75.9589,11.6891],[75.9626,11.6914],[75.9642,11.6979],[75.967,11.6991],[75.9674,11.7031],[75.9644,11.7038],[75.9623,11.7023],[75.9598,11.7045],[75.9599,11.7085],[75.9574,11.7095],[75.9533,11.7031]]]}},{"type":"Feature","properties":{"ward_no":23},"geometry":{"type":"Polygon","coordinates":[[[75.9518,11.6946],[75.9528,11.6972],[75.9512,11.6999],[75.9533,11.7031],[75.9475,11.7048],[75.9458,11.7102],[75.9428,11.7123],[75.9383,11.7119],[75.9308,11.7142],[75.9278,11.7142],[75.9128,11.7051],[75.9019,11.7039],[75.9001,11.6988],[75.8977,11.6984],[75.9008,11.6944],[75.9115,11.6891],[75.9216,11.6914],[75.9276,11.6877],[75.9436,11.6962],[75.9493,11.6965],[75.9518,11.6946]]]}},{"type":"Feature","properties":{"ward_no":24},"geometry":{"type":"Polygon","coordinates":[[[75.9019,11.7039],[75.913,11.7052],[75.9279,11.7142],[75.937,11.7128],[75.9399,11.7267],[75.9342,11.724],[75.9325,11.7259],[75.9337,11.7279],[75.9319,11.7281],[75.9313,11.731],[75.9265,11.7302],[75.9207,11.7259],[75.9197,11.7217],[75.9219,11.7181],[75.9164,11.7167],[75.9103,11.7231],[75.9086,11.7216],[75.9085,11.7185],[75.9048,11.7176],[75.9002,11.711],[75.9019,11.7039]]]}}]};

// ─── WARD DATA ─────────────────────────────────────────────────────────────────
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
  "#a8c8e0","#b8d4a8","#f0c898","#e8b0b0","#f0e098","#b8d8d0","#d4b8d4","#c8d8b0",
];

// Ward-level deficit data (realistic synthetic scores 0-100, higher = worse off)
const WARD_DEFICIT = {
  1:  {infra:72, hazard:35, popPressure:28, socialVuln:68, accessDef:65, pop:1820},
  2:  {infra:45, hazard:28, popPressure:62, socialVuln:42, accessDef:30, pop:1650},
  3:  {infra:38, hazard:22, popPressure:55, socialVuln:35, accessDef:28, pop:1710},
  4:  {infra:58, hazard:42, popPressure:38, socialVuln:55, accessDef:52, pop:1580},
  5:  {infra:30, hazard:30, popPressure:70, socialVuln:38, accessDef:22, pop:2100},
  6:  {infra:42, hazard:55, popPressure:45, socialVuln:40, accessDef:35, pop:1620},
  7:  {infra:65, hazard:62, popPressure:32, socialVuln:72, accessDef:68, pop:1480},
  8:  {infra:55, hazard:38, popPressure:48, socialVuln:58, accessDef:45, pop:1750},
  9:  {infra:48, hazard:45, popPressure:42, socialVuln:45, accessDef:40, pop:1690},
  10: {infra:60, hazard:72, popPressure:25, socialVuln:65, accessDef:70, pop:1520},
  11: {infra:50, hazard:40, popPressure:38, socialVuln:50, accessDef:48, pop:1610},
  12: {infra:35, hazard:30, popPressure:52, socialVuln:32, accessDef:30, pop:1850},
  13: {infra:70, hazard:68, popPressure:20, socialVuln:75, accessDef:78, pop:1350},
  14: {infra:55, hazard:35, popPressure:35, socialVuln:48, accessDef:55, pop:1580},
  15: {infra:78, hazard:75, popPressure:28, socialVuln:82, accessDef:80, pop:1420},
  16: {infra:52, hazard:42, popPressure:40, socialVuln:52, accessDef:50, pop:1670},
  17: {infra:68, hazard:60, popPressure:32, socialVuln:70, accessDef:72, pop:1490},
  18: {infra:75, hazard:80, popPressure:22, socialVuln:78, accessDef:75, pop:1380},
  19: {infra:60, hazard:48, popPressure:35, socialVuln:62, accessDef:58, pop:1550},
  20: {infra:48, hazard:35, popPressure:45, socialVuln:44, accessDef:42, pop:1700},
  21: {infra:72, hazard:65, popPressure:25, socialVuln:76, accessDef:72, pop:1440},
  22: {infra:80, hazard:70, popPressure:18, socialVuln:85, accessDef:85, pop:1310},
  23: {infra:82, hazard:55, popPressure:15, socialVuln:80, accessDef:82, pop:1290},
  24: {infra:75, hazard:45, popPressure:22, socialVuln:72, accessDef:68, pop:1420},
};

const CATEGORIES = [
  {id:"infra", label:"Infrastructure", icon:"🏗️", color:"#2d6a4f"},
  {id:"agri", label:"Agriculture & Livelihoods", icon:"🌾", color:"#606c38"},
  {id:"health", label:"Health & Welfare", icon:"🏥", color:"#bc4749"},
  {id:"edu", label:"Education & Children", icon:"📚", color:"#4361ee"},
  {id:"women", label:"Women & Gender", icon:"👩", color:"#9b2226"},
  {id:"water", label:"Water & Sanitation", icon:"💧", color:"#0077b6"},
  {id:"elderly", label:"Elderly Care", icon:"🧓", color:"#774936"},
  {id:"youth", label:"Youth & Sports", icon:"⚽", color:"#e76f51"},
];

const BENEFICIARY_TYPES = [
  "General Public","Farmers","Women","Children","Elderly","BPL Households",
  "SC Community","ST Community","Persons with Disability","Youth","Fisherfolk","Dairy Farmers"
];

const GP_BALLOT = [
  {id:1,title:"Comprehensive Paddy Development Programme",cost:6200000,cat:"agri",benef:"Farmers",votes:23,mal:"സമഗ്ര നെൽകൃഷി വികസനം"},
  {id:2,title:"Milk Subsidy for Dairy Farmers",cost:6000000,cat:"agri",benef:"Farmers",votes:22,mal:"ക്ഷീര കർഷക സബ്സിഡി"},
  {id:3,title:"She-Lodge Construction",cost:3000000,cat:"women",benef:"Women",votes:18,mal:"She-Lodge നിർമ്മാണം"},
  {id:4,title:"Dairy Fodder Subsidy",cost:2800000,cat:"agri",benef:"Farmers",votes:20,mal:"കാലിത്തീറ്റ സബ്സിഡി"},
  {id:5,title:"Town Renovation Programme",cost:2000000,cat:"infra",benef:"General",votes:15,mal:"ടൗൺ നവീകരണം"},
  {id:6,title:"Take-a-Break Vellamunda Tourism",cost:2000000,cat:"infra",benef:"General",votes:12,mal:"ടേക്ക് എ ബ്രേക്ക്"},
  {id:7,title:"Interactive Displays for Schools",cost:1500000,cat:"edu",benef:"Children",votes:18,mal:"സ്കൂൾ ഇന്ററാക്ടീവ് ഡിസ്പ്ലേ"},
  {id:8,title:"Mini Dairy Farm Modernization",cost:1400000,cat:"agri",benef:"Farmers",votes:14,mal:"ഡയറി ഫാം ആധുനീകരണം"},
  {id:9,title:"Pepper & Lime Distribution",cost:1100000,cat:"agri",benef:"Farmers",votes:14,mal:"കുരുമുളക്/നാരങ്ങ"},
  {id:10,title:"Shelter Home Construction",cost:1000000,cat:"infra",benef:"General",votes:9,mal:"ഷെൽട്ടർ ഹോം"},
  {id:11,title:"Women Marketing Centre",cost:1000000,cat:"women",benef:"Women",votes:10,mal:"വനിതാ മാർക്കറ്റിംഗ്"},
  {id:12,title:"Ayurveda Health Programme for Aged",cost:800000,cat:"elderly",benef:"Elderly",votes:8,mal:"വയോജന ആയുർവേദ"},
  {id:13,title:"Poultry Distribution (BPL)",cost:700000,cat:"agri",benef:"Farmers, BPL",votes:7,mal:"കോഴി വിതരണം"},
  {id:14,title:"School Furniture Purchase",cost:667000,cat:"edu",benef:"Children",votes:7,mal:"സ്കൂൾ ഫർണിച്ചർ"},
  {id:15,title:"Vegetable Cultivation Subsidy",cost:500000,cat:"agri",benef:"Farmers",votes:8,mal:"പച്ചക്കറി കൃഷി"},
  {id:16,title:"Makaloppam Education Project",cost:500000,cat:"edu",benef:"Children",votes:6,mal:"മകളൊപ്പം"},
  {id:17,title:"Dialysis Centre Share",cost:500000,cat:"health",benef:"General",votes:5,mal:"ഡയാലിസിസ്"},
  {id:18,title:"FHC Renovation Works",cost:500000,cat:"health",benef:"General",votes:7,mal:"FHC നവീകരണം"},
  {id:19,title:"Jagratha Samithi Women Protection",cost:422400,cat:"women",benef:"Women",votes:8,mal:"ജാഗ്രതാ സമിതി"},
  {id:20,title:"Clean Childhood Programme",cost:325000,cat:"edu",benef:"Children",votes:5,mal:"ശുദ്ധ ബാല്യം"},
];

const WARD_BALLOT_SAMPLES = {
  1:[{id:101,title:"Solar Street Lighting - Kandathuvayal",cost:550000,cat:"infra"},{id:102,title:"Ward Playground Development",cost:720000,cat:"youth"},{id:103,title:"School Compound Wall",cost:890000,cat:"edu"},{id:104,title:"Health Sub-Centre Upgrade",cost:610000,cat:"health"},{id:105,title:"Bus Shelter Construction",cost:350000,cat:"infra"},{id:106,title:"Cultural Centre Upgrade",cost:780000,cat:"infra"},{id:107,title:"Footpath Construction",cost:520000,cat:"infra"},{id:108,title:"Anganwadi Upgrade",cost:380000,cat:"edu"}],
  6:[{id:601,title:"LED Street Light Cluster - Kattayad",cost:420000,cat:"infra"},{id:602,title:"Flood Protection Wall",cost:1250000,cat:"infra"},{id:603,title:"Library Reading Room",cost:580000,cat:"edu"},{id:604,title:"Outdoor Gym",cost:450000,cat:"youth"},{id:605,title:"School Science Lab",cost:1800000,cat:"edu"},{id:606,title:"Smart Classroom",cost:2200000,cat:"edu"},{id:607,title:"Side Wall Protection",cost:670000,cat:"infra"},{id:608,title:"Crematorium Development",cost:910000,cat:"infra"}],
  12:[{id:1201,title:"Solar Street Lighting - Kappumkunnu",cost:630000,cat:"infra"},{id:1202,title:"Footpath Construction",cost:480000,cat:"infra"},{id:1203,title:"Ward Playground",cost:680000,cat:"youth"},{id:1204,title:"Public Hall Renovation",cost:950000,cat:"infra"},{id:1205,title:"Anganwadi Upgrade",cost:410000,cat:"edu"},{id:1206,title:"Cultural Centre Upgrade",cost:1050000,cat:"infra"},{id:1207,title:"School Compound Wall",cost:1100000,cat:"edu"},{id:1208,title:"Health Sub-Centre Upgrade",cost:720000,cat:"health"}],
};

const FORUM_IDEAS_INIT = [
  {id:1,title:"Organic farming cooperative for Vellamunda",desc:"We should establish a GP-level cooperative that provides organic certification, seed banks, and marketing support for our farmers. Many families depend on coffee and pepper — organic premium prices would boost income by 20-30%.",author:"Suresh K.",ward:3,cat:"agri",upvotes:34,downvotes:2,comments:[{author:"Meera V.",text:"Great idea! Our Kudumbashree group in ward 9 is already doing small-scale organic. A GP cooperative would give us bargaining power.",ts:"2 days ago"},{author:"Thomas P.",text:"What about the transition period? Farmers need support for 2-3 years before organic certification kicks in.",ts:"1 day ago"}],ts:"4 days ago"},
  {id:2,title:"Community well recharge programme using traditional methods",desc:"Before monsoon, each ward should construct 3-4 recharge pits near existing wells. Karingari and Kappumkunnu wards have severe water shortage in summer. Cost is minimal — ₹50,000 per pit using local labour.",author:"Ravi M.",ward:11,cat:"water",upvotes:28,downvotes:1,comments:[{author:"Lakshmi S.",text:"Ward 12 desperately needs this. Our wells went dry last April.",ts:"3 days ago"}],ts:"5 days ago"},
  {id:3,title:"Women's skill training centre with crèche",desc:"Many women in our GP want to learn tailoring, food processing and computer skills but have no childcare. A training centre with an attached crèche would help. Could partner with KILA or ITI.",author:"Bindu T.",ward:18,cat:"women",upvotes:42,downvotes:5,comments:[{author:"Sathi R.",text:"This is exactly what we discussed at the last ward sabha!",ts:"1 day ago"},{author:"Priya K.",text:"The existing ITI building in ward 5 has unused space.",ts:"12 hours ago"}],ts:"6 days ago"},
  {id:4,title:"Solar-powered street lights on Kokkadavu–Tharuvana stretch",desc:"The 2km road from Kokkadavu junction to Tharuvana school has zero lighting. Students and elderly people are at risk. Solar lights would cost around ₹5L.",author:"Anil P.",ward:7,cat:"infra",upvotes:19,downvotes:0,comments:[],ts:"3 days ago"},
  {id:5,title:"Mobile health clinic for remote tribal hamlets",desc:"Paniya and Kuruma settlements in wards 15, 17, 21 have to walk 5+ km to reach the FHC. A weekly mobile clinic with basic medicines, BP/sugar testing, and maternal checkups would save lives.",author:"Dr. Asha K.",ward:15,cat:"health",upvotes:51,downvotes:3,comments:[{author:"Kunju M.",text:"As an ASHA worker, I can confirm — pregnant women in Mothakkara settlement missed 40% of checkups last year.",ts:"2 days ago"}],ts:"7 days ago"},
  {id:6,title:"Outdoor gym equipment in 5 major ward parks",desc:"Youth in Vellamunda have nowhere to exercise. Installing outdoor gym equipment in existing public spaces in wards 1, 6, 10, 14, 22 would cost ₹3-4L per ward.",author:"Vishnu S.",ward:14,cat:"youth",upvotes:15,downvotes:8,comments:[{author:"Mary J.",text:"Can we include a walking track for elderly too?",ts:"5 hours ago"}],ts:"2 days ago"},
];

const RESULTS_DATA = [
  {pool:"GP-Wide",mes:30,greedy:40,diff:10,budget:294},
  {pool:"Ward Pools",mes:37,greedy:61,diff:28,budget:294},
  {pool:"Water/San",mes:10,greedy:16,diff:6,budget:105},
  {pool:"SC Sub-Ballot",mes:7,greedy:10,diff:3,budget:26},
  {pool:"ST Oorukoottam",mes:33,greedy:38,diff:5,budget:188},
  {pool:"Road Maint",mes:41,greedy:51,diff:10,budget:214},
];

// Workshop schedule data
const WORKSHOP_EVENTS = [
  {id:1,type:"Ward Sabha",ward:"All 24 Wards",date:"2026-09-15",endDate:"2026-10-10",location:"Respective Ward Community Halls",agenda:["Presentation of annual plan overview","Needs identification by households","Collection of raw proposals","Discussion of unresolved last-year issues"],color:"#2d6a4f",icon:"🏘️"},
  {id:2,type:"Oorukoottam",ward:"Wards 7,13,15,17,18,21,22,23",date:"2026-11-05",endDate:"2026-11-20",location:"Tribal Settlements (Unnati Colonies)",agenda:["ST sub-plan project discussion","TSP fund allocation review","Approval of tribal hamlet projects","Election of ST community representatives"],color:"#774936",icon:"🏔️"},
  {id:3,type:"Women's Gram Sabha",ward:"GP-Level",date:"2026-11-12",endDate:"2026-11-12",location:"Vellamunda Panchayat Hall",agenda:["WCP-eligible project review","Kudumbashree NHG presentations","Gender budget analysis","Women empowerment scheme updates"],color:"#9b2226",icon:"👩‍👩‍👧"},
  {id:4,type:"Technical Working Group",ward:"GP-Level",date:"2026-11-25",endDate:"2026-12-10",location:"Block Office, Vellamunda",agenda:["Feasibility assessment of 47 proposals","Cost estimation review","Environmental impact screening","Legal compliance verification"],color:"#d4a843",icon:"🔧"},
  {id:5,type:"Accessibility Workshop",ward:"GP-Level",date:"2026-12-08",endDate:"2026-12-08",location:"Vellamunda Panchayat Hall",agenda:["Proposals for elderly and disabled","Home visits for bedridden citizens","Sign language ballot support","Simplified material distribution"],color:"#0077b6",icon:"♿"},
  {id:6,type:"Pre-Ballot Deliberation",ward:"All Wards",date:"2026-12-20",endDate:"2027-01-05",location:"School Auditoriums (Ward-wise)",agenda:["Final ballot presentation","MES explanation to citizens","Q&A on proposal costs","Voter registration drive"],color:"#4361ee",icon:"🗣️"},
  {id:7,type:"Digital Ballot Opens",ward:"GP-Wide",date:"2027-01-15",endDate:"2027-02-15",location:"Online + Akshaya Centres",agenda:["Approval voting portal live","Paper ballot available at Panchayat office","Mobile voting via WhatsApp OTP","Dedicated slots for senior citizens"],color:"#2d6a4f",icon:"🗳️"},
  {id:8,type:"MES Results Announcement",ward:"GP-Wide",date:"2027-02-20",endDate:"2027-02-20",location:"Panchayat Auditorium (Live Streamed)",agenda:["MES vs Greedy comparison","Welfare criterion analysis","Standing Committee ratification","Winners integration into ADP"],color:"#1a3a2a",icon:"📊"},
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

const fmt = (n) => n >= 10000000 ? `₹${(n/10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n/100000).toFixed(1)} L` : `₹${n.toLocaleString("en-IN")}`;

// ─── AI UTILITIES (Claude API) ─────────────────────────────────────────────────
async function aiDetectCategory(title, desc) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:50,
        messages:[{role:"user",content:`Classify this citizen proposal into EXACTLY ONE of these category IDs. Reply with ONLY the id, nothing else.

Categories:
- infra (roads, lighting, buildings, construction, drainage, footpaths, walls)
- agri (farming, crops, livestock, dairy, poultry, fishery, horticulture)  
- health (hospital, clinic, medicine, disease, maternal, dialysis)
- edu (school, college, library, children, anganwadi, training)
- women (women, gender, self-help group, WCP, she-lodge, crèche)
- water (well, pipe, drainage, sanitation, toilet, waste, flood)
- elderly (aged, senior, old age, pension, ayurveda for aged)
- youth (sports, playground, gym, youth, cultural, park)

Title: ${title}
Description: ${desc}

Category ID:`}]
      })
    });
    const data = await res.json();
    const cat = data.content?.[0]?.text?.trim().toLowerCase();
    const validCats = ["infra","agri","health","edu","women","water","elderly","youth"];
    return validCats.includes(cat) ? cat : null;
  } catch(e) { return null; }
}

async function aiCheckDuplicate(newTitle, newDesc, existing) {
  if (existing.length === 0) return {isDuplicate:false,similarity:0,similar:null};
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:200,
        messages:[{role:"user",content:`You are a deduplication AI for a participatory budgeting system. Check if the NEW PROPOSAL is substantively similar to any EXISTING PROPOSAL.

NEW PROPOSAL: "${newTitle}" — ${newDesc}

EXISTING PROPOSALS:
${existing.slice(0,8).map((p,i) => `${i+1}. "${p.title}"`).join("\n")}

Reply with ONLY valid JSON (no markdown):
{"isDuplicate": true/false, "similarity": 0-100, "similar": "title of similar proposal or null"}`}]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "{}";
    return JSON.parse(text.replace(/```json|```/g,"").trim());
  } catch(e) { return {isDuplicate:false,similarity:0,similar:null}; }
}

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function SectionTitle({children,sub}) {
  return (
    <div style={{marginBottom:20}}>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#1a3a2a",margin:"0 0 6px"}}>{children}</h2>
      {sub && <p style={{fontSize:13,color:"#8a8070",margin:0,lineHeight:1.5}}>{sub}</p>}
    </div>
  );
}
function Badge({children,color="#2d6a4f"}) {
  return <span style={{background:color,color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:12,fontWeight:600,display:"inline-block"}}>{children}</span>;
}
function CatBadge({catId}) {
  const c = CATEGORIES.find(x=>x.id===catId);
  if(!c) return null;
  return <span style={{background:`${c.color}20`,color:c.color,fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:600,display:"inline-flex",alignItems:"center",gap:3}}>{c.icon} {c.label}</span>;
}
function AIBadge({label}) {
  return <span style={{background:"linear-gradient(90deg,#4361ee,#7c3aed)",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}>✦ AI: {label}</span>;
}

// ─── INTERACTIVE WARD MAP ──────────────────────────────────────────────────────
function WardMap({
  selectedWard, onSelectWard,
  hoverWard, onHoverWard,
  pinMode=false, pins=[], onAddPin,
  highlightLayer=null, // "infra"|"hazard"|"social"
  compact=false
}) {
  const svgRef = useRef(null);
  const W = compact ? 560 : 820, H = compact ? 330 : 480;

  const {projection, pathGen, wardPaths} = useMemo(() => {
    const proj = d3.geoMercator().fitSize([W, H], WARD_GEOJSON);
    const pg = d3.geoPath().projection(proj);
    const paths = WARD_GEOJSON.features.map(f => {
      const wn = f.properties.ward_no;
      const ward = WARDS.find(w => w.n === wn);
      const centroid = pg.centroid(f.geometry);
      return {wardNo:wn, name:ward?.name||"", d:pg(f.geometry), centroid};
    });
    return {projection:proj, pathGen:pg, wardPaths:paths};
  }, [W, H]);

  const getColor = useCallback((wardNo) => {
    if (selectedWard === wardNo) return "#1a3a2a";
    if (hoverWard === wardNo) return "#2d6a4f";
    if (highlightLayer) {
      const d = WARD_DEFICIT[wardNo];
      if (!d) return "#ccc";
      let score;
      if (highlightLayer === "infra") score = d.infra;
      else if (highlightLayer === "hazard") score = d.hazard;
      else if (highlightLayer === "social") score = d.socialVuln;
      else if (highlightLayer === "access") score = d.accessDef;
      else score = (d.infra + d.hazard + d.socialVuln + d.accessDef) / 4;
      const t = score / 100;
      const r = Math.round(255 * t + 240 * (1-t));
      const g = Math.round(100 * t + 230 * (1-t));
      const b = Math.round(90 * t + 210 * (1-t));
      return `rgb(${r},${g},${b})`;
    }
    return MAP_PALETTE[(wardNo - 1) % MAP_PALETTE.length];
  }, [selectedWard, hoverWard, highlightLayer]);

  const getTextColor = (wardNo) => selectedWard === wardNo ? "#f0d78c" : "#1a3a2a";

  const handleSvgClick = useCallback((e) => {
    if (!pinMode || !projection) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (W / rect.width);
    const y = (e.clientY - rect.top) * (H / rect.height);
    const [lng, lat] = projection.invert([x, y]);
    onAddPin?.({x, y, lng, lat});
  }, [pinMode, projection, W, H, onAddPin]);

  return (
    <div style={{position:"relative", background:"#f5f0e6", borderRadius:12, overflow:"hidden", border:"1px solid #d8d0c4"}}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{width:"100%", cursor: pinMode ? "crosshair" : "default", display:"block"}} onClick={handleSvgClick}>
        {/* Background */}
        <rect width={W} height={H} fill="#eee8dc" />
        {/* Grid lines */}
        {[...Array(10)].map((_,i) => <line key={`h${i}`} x1={0} y1={H*i/10} x2={W} y2={H*i/10} stroke="#d8d0c4" strokeWidth={0.5} strokeDasharray="4,4" />)}
        {[...Array(14)].map((_,i) => <line key={`v${i}`} x1={W*i/14} y1={0} x2={W*i/14} y2={H} stroke="#d8d0c4" strokeWidth={0.5} strokeDasharray="4,4" />)}

        {/* Ward polygons */}
        {wardPaths.map(wp => (
          <g key={wp.wardNo}>
            <path
              d={wp.d}
              fill={getColor(wp.wardNo)}
              stroke={selectedWard === wp.wardNo ? "#1a3a2a" : "#fff"}
              strokeWidth={selectedWard === wp.wardNo ? 2.5 : 1}
              style={{transition:"fill 0.2s, stroke 0.2s"}}
              onMouseEnter={() => onHoverWard?.(wp.wardNo)}
              onMouseLeave={() => onHoverWard?.(null)}
              onClick={(e) => {e.stopPropagation(); !pinMode && onSelectWard?.(wp.wardNo);}}
              cursor={pinMode ? "crosshair" : "pointer"}
            />
            {!compact && (
              <g style={{pointerEvents:"none"}}>
                <circle cx={wp.centroid[0]} cy={wp.centroid[1]} r={12} fill={selectedWard===wp.wardNo?"#1a3a2a":"#1a3a2a"} opacity={0.85} />
                <text x={wp.centroid[0]} y={wp.centroid[1]+1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight="700" fill={getTextColor(wp.wardNo)} style={{fontFamily:"sans-serif"}}>{wp.wardNo}</text>
              </g>
            )}
          </g>
        ))}

        {/* Proposal pins */}
        {pins.map((pin,i) => (
          <g key={i}>
            <circle cx={pin.x} cy={pin.y} r={10} fill="#bc4749" stroke="#fff" strokeWidth={2} />
            <line x1={pin.x} y1={pin.y} x2={pin.x} y2={pin.y+16} stroke="#bc4749" strokeWidth={2} />
            <circle cx={pin.x} cy={pin.y+18} r={3} fill="#bc4749" />
          </g>
        ))}

        {/* North arrow */}
        <g transform={`translate(${W-36},28)`}>
          <polygon points="0,-14 -5,4 0,0 5,4" fill="#1a3a2a" />
          <text y={14} textAnchor="middle" fontSize={10} fill="#1a3a2a" fontWeight="700" style={{fontFamily:"sans-serif"}}>N</text>
        </g>

        {/* Scale bar */}
        <g transform={`translate(16,${H-24})`}>
          <rect width={60} height={6} fill="#1a3a2a" opacity={0.6} rx={2} />
          <rect x={60} width={60} height={6} fill="none" stroke="#1a3a2a" opacity={0.6} rx={2} />
          <text y={18} fontSize={8} fill="#1a3a2a" opacity={0.7} style={{fontFamily:"sans-serif"}}>0    1 km</text>
        </g>
      </svg>
    </div>
  );
}

// ─── PHASE 0: WELCOME ──────────────────────────────────────────────────────────
function WelcomePhase({onNext}) {
  return (
    <div>
      <div className="fade-up" style={{marginBottom:28,textAlign:"center",padding:"20px 0 0"}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:34,color:"#1a3a2a",margin:"0 0 8px"}}>ജനകീയ ബജറ്റ് 2026-27</h1>
        <p style={{fontSize:15,color:"#6b6357",maxWidth:560,margin:"0 auto 20px",lineHeight:1.7}}>Vellamunda Grama Panchayat's AI-assisted Participatory Budgeting portal — where every ward's voice shapes the annual plan.</p>
        <button onClick={onNext} style={{background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)",color:"#fff",border:"none",padding:"14px 36px",borderRadius:12,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:8}}>
          Explore the Map <ArrowRight size={18} />
        </button>
      </div>

      <div className="fade-up-d1" style={{marginBottom:28}}>
        <SectionTitle sub="A global movement that has reached Kerala's grassroots">What is Participatory Budgeting?</SectionTitle>
        <div className="card" style={{padding:"24px 28px"}}>
          <p style={{fontSize:14,lineHeight:1.8,color:"#3a3530",margin:"0 0 16px"}}>Participatory Budgeting (PB) is a democratic process where community members directly decide how to spend part of a public budget. Kerala's <strong>People's Plan Campaign</strong> since 1996 pioneered grassroots planning through Ward Sabhas.</p>
          <div style={{background:"#f0ebe1",borderRadius:10,padding:"16px 20px",borderLeft:"4px solid #d4a843"}}>
            <p style={{fontSize:13,lineHeight:1.7,color:"#4a4540",margin:0}}><strong style={{color:"#1a3a2a"}}>Our proposal:</strong> Replace opaque aggregation with the <strong>Method of Equal Shares (MES)</strong> — a mathematically fair voting rule guaranteeing every cohesive group proportional representation, verified with AI-powered deduplication and classification.</p>
          </div>
        </div>
      </div>

      <div className="stat-grid fade-up-d2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28}}>
        {[{n:"₹25.41 Cr",l:"Annual Plan Outlay",icon:"💰"},{n:"24",l:"Wards in Vellamunda",icon:"🗺️"},{n:"40,627",l:"Population (Census 2011)",icon:"👥"},{n:"208",l:"Projects in ADR 2026-27",icon:"📋"}].map((s,i) => (
          <div key={i} className="card" style={{padding:"18px 16px",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:4}}>{s.icon}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1a3a2a"}}>{s.n}</div>
            <div style={{fontSize:11,color:"#8a8070",marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className="fade-up-d3">
        <SectionTitle sub="Seven steps from ward sabha to implementation">How the PB Process Works</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
          {[{s:1,t:"Ward Sabha",d:"Citizens meet in each ward",m:"Sep–Oct",i:"🏘️"},{s:2,t:"Idea Forum",d:"Submit & discuss online",m:"Oct–Nov",i:"💡"},{s:3,t:"Working Groups",d:"Expert feasibility review",m:"Nov–Dec",i:"👷"},{s:4,t:"Deliberation",d:"Offline inclusion workshops",m:"Dec–Jan",i:"🤝"},{s:5,t:"Ballot & Vote",d:"Approval voting by all",m:"Jan–Feb",i:"🗳️"},{s:6,t:"MES Results",d:"Fair aggregation output",m:"Feb",i:"📊"},{s:7,t:"Implementation",d:"Winners enter ADP",m:"Mar–",i:"🚀"}].map((s,i) => (
            <div key={i} className="card" style={{padding:"16px 14px",textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:6}}>{s.i}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#1a3a2a",marginBottom:4}}>{s.t}</div>
              <div style={{fontSize:11,color:"#6b6357",lineHeight:1.5}}>{s.d}</div>
              <div style={{fontSize:10,color:"#a09888",marginTop:8,fontWeight:600}}>{s.m}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PHASE 1: GIS MAP ──────────────────────────────────────────────────────────
function MapPhase() {
  const [selectedWard, setSelectedWard] = useState(null);
  const [hoverWard, setHoverWard] = useState(null);
  const [highlightLayer, setHighlightLayer] = useState(null);
  const [showProposals, setShowProposals] = useState(false);

  const ward = selectedWard ? WARDS.find(w => w.n === selectedWard) : null;
  const deficit = selectedWard ? WARD_DEFICIT[selectedWard] : null;

  const composite = deficit ? Math.round(
    (deficit.infra*0.30 + deficit.hazard*0.20 + deficit.popPressure*0.10 + deficit.socialVuln*0.25 + deficit.accessDef*0.15)
  ) : 0;

  const layers = [
    {id:null,label:"Ward Boundaries",icon:"🗺️"},
    {id:"infra",label:"Infra Deficit",icon:"🏗️"},
    {id:"hazard",label:"Hazard Exposure",icon:"⚠️"},
    {id:"social",label:"Social Vulnerability",icon:"👥"},
    {id:"access",label:"Access Deficit",icon:"🏥"},
  ];

  return (
    <div>
      <SectionTitle sub="24 ward boundaries from K-SMART delimitation. Click any ward to explore.">Ward Boundary & Vulnerability Map</SectionTitle>

      {/* Layer selector */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:600,color:"#6b6357"}}>Overlay:</span>
        {layers.map(l => (
          <button key={String(l.id)} onClick={() => setHighlightLayer(l.id)} style={{
            padding:"5px 12px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"inherit",
            background:highlightLayer===l.id?"#1a3a2a":"#fff",
            color:highlightLayer===l.id?"#f0d78c":"#4a4540",
            border:highlightLayer===l.id?"1px solid #1a3a2a":"1px solid #d8d0c4",
            fontWeight:highlightLayer===l.id?700:400,
            transition:"all 0.2s",
          }}>{l.icon} {l.label}</button>
        ))}
        {highlightLayer && (
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#6b6357"}}>
            <div style={{width:12,height:12,background:"#f0e6d0",border:"1px solid #ccc",borderRadius:2}} /> Low
            <div style={{width:50,height:8,background:"linear-gradient(90deg,#f0e6d0,#ff6464)",borderRadius:4}} />
            <div style={{width:12,height:12,background:"#ff6464",borderRadius:2}} /> High
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:2,minWidth:300}}>
          <WardMap
            selectedWard={selectedWard} onSelectWard={setSelectedWard}
            hoverWard={hoverWard} onHoverWard={setHoverWard}
            highlightLayer={highlightLayer}
          />
          {/* Hover tooltip */}
          {hoverWard && (
            <div style={{padding:"8px 12px",background:"#1a3a2a",color:"#f0d78c",borderRadius:8,fontSize:12,marginTop:8,display:"inline-flex",alignItems:"center",gap:8}}>
              <MapPin size={12} /> Ward {hoverWard} — {WARDS.find(w=>w.n===hoverWard)?.name}
              {WARD_DEFICIT[hoverWard] && <span style={{color:"rgba(255,255,255,0.7)"}}>| Pop: {WARD_DEFICIT[hoverWard].pop.toLocaleString("en-IN")}</span>}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{flex:1,minWidth:260,display:"flex",flexDirection:"column",gap:12}}>
          {selectedWard && ward && deficit ? (
            <>
              <div className="card" style={{padding:"20px",background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)",color:"#fff"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:36,height:36,background:"rgba(240,215,140,0.2)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#f0d78c"}}>{ward.n}</div>
                  <div>
                    <div style={{fontSize:16,fontWeight:700,color:"#f0d78c"}}>{ward.name}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Population: {deficit.pop.toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>Composite Deficit Index</span>
                  <span style={{fontSize:24,fontWeight:700,color: composite>60?"#ef4444":composite>40?"#f59e0b":"#4ade80"}}>{composite}</span>
                </div>
                <div style={{height:6,background:"rgba(255,255,255,0.2)",borderRadius:4,marginTop:8,overflow:"hidden"}}>
                  <div style={{width:`${composite}%`,height:"100%",background:composite>60?"#ef4444":composite>40?"#f59e0b":"#4ade80",transition:"width 0.5s ease"}} />
                </div>
              </div>

              <div className="card" style={{padding:"18px"}}>
                <h4 style={{fontSize:13,fontWeight:700,color:"#1a3a2a",margin:"0 0 12px"}}>Deficit Breakdown</h4>
                {[
                  {label:"Infrastructure",key:"infra",icon:"🏗️"},
                  {label:"Hazard Exposure",key:"hazard",icon:"⚠️"},
                  {label:"Social Vulnerability",key:"socialVuln",icon:"👥"},
                  {label:"Accessibility",key:"accessDef",icon:"🏥"},
                  {label:"Pop. Pressure",key:"popPressure",icon:"📈"},
                ].map(d => (
                  <div key={d.key} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                      <span style={{color:"#4a4540"}}>{d.icon} {d.label}</span>
                      <span style={{fontWeight:700,color:"#1a3a2a"}}>{deficit[d.key]}</span>
                    </div>
                    <div style={{height:5,background:"#f0ebe1",borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${deficit[d.key]}%`,height:"100%",background:deficit[d.key]>60?"#bc4749":deficit[d.key]>40?"#d4a843":"#2d6a4f",transition:"width 0.4s ease"}} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{padding:"18px",background:"#faf5ea"}}>
                <h4 style={{fontSize:13,fontWeight:700,color:"#1a3a2a",margin:"0 0 10px"}}>Proposals This Ward</h4>
                {(WARD_BALLOT_SAMPLES[selectedWard] || [{title:"No sample proposals loaded",cost:0,cat:"infra"}]).slice(0,3).map((p,i) => (
                  <div key={i} style={{fontSize:12,padding:"8px 10px",background:"#fff",borderRadius:8,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{color:"#3a3530",lineHeight:1.4}}>{p.title}</span>
                    <span style={{fontSize:11,fontWeight:600,color:"#2d6a4f",flexShrink:0,marginLeft:8}}>{fmt(p.cost)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card" style={{padding:"28px",textAlign:"center",background:"#faf8f4"}}>
              <div style={{fontSize:40,marginBottom:12}}>🗺️</div>
              <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#1a3a2a",margin:"0 0 8px"}}>Select a Ward</h3>
              <p style={{fontSize:13,color:"#8a8070",lineHeight:1.6,margin:0}}>Click any ward on the map to view its profile, deficit indicators, and existing proposals.</p>
              <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{v:"High Deficit",n:"Wards 15,18,22,23",c:"#ef4444"},{v:"Moderate",n:"Wards 7,10,13,17",c:"#f59e0b"},{v:"Lower Deficit",n:"Wards 2,3,5,12",c:"#2d6a4f"},{v:"Central Wards",n:"Wards 5,6,8,9",c:"#0077b6"}].map((g,i) => (
                  <div key={i} style={{padding:"10px",background:"#fff",borderRadius:8,borderLeft:`3px solid ${g.c}`}}>
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

// ─── PHASE 2: IDEATE (ENHANCED) ────────────────────────────────────────────────
function IdeatePhase() {
  const [form, setForm] = useState({title:"",desc:"",cat:"",ward:"",benef:"",cost:"",mobile:""});
  const [submitted, setSubmitted] = useState(false);
  const [aiState, setAiState] = useState({catLoading:false,catSuggested:null,dupLoading:false,dupResult:null});
  const [showMapPin, setShowMapPin] = useState(false);
  const [pins, setPins] = useState([]);
  const [pinLngLat, setPinLngLat] = useState(null);

  const existingProposals = FORUM_IDEAS_INIT.map(p => ({title:p.title}));

  const handleAutoDetect = async () => {
    if (!form.title && !form.desc) return;
    setAiState(s => ({...s, catLoading:true, catSuggested:null}));
    const cat = await aiDetectCategory(form.title, form.desc);
    setAiState(s => ({...s, catLoading:false, catSuggested:cat}));
    if (cat) setForm(f => ({...f, cat}));
  };

  const handleDupCheck = async () => {
    if (!form.title) return;
    setAiState(s => ({...s, dupLoading:true, dupResult:null}));
    const result = await aiCheckDuplicate(form.title, form.desc, existingProposals);
    setAiState(s => ({...s, dupLoading:false, dupResult:result}));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.desc || !form.ward) return;
    await handleDupCheck();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({title:"",desc:"",cat:"",ward:"",benef:"",cost:"",mobile:""}); setPins([]); setPinLngLat(null); setAiState({catLoading:false,catSuggested:null,dupLoading:false,dupResult:null}); }, 5000);
  };

  const handleAddPin = ({x,y,lng,lat}) => {
    setPins([{x,y}]);
    setPinLngLat({lng:lng.toFixed(5),lat:lat.toFixed(5)});
  };

  const inp = (field, props={}) => ({
    value:form[field],
    onChange: e => setForm({...form,[field]:e.target.value}),
    style:{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:14,boxSizing:"border-box",fontFamily:"inherit",...(props.style||{})},
    ...props
  });

  return (
    <div>
      <SectionTitle sub="AI assists with category detection, duplicate prevention, and routing to relevant committees.">Submit Your Proposal</SectionTitle>
      <div className="two-col" style={{display:"flex",gap:24,alignItems:"flex-start"}}>
        <div style={{flex:2}}>
          <div className="card fade-up" style={{padding:"28px"}}>
            {submitted && (
              <div style={{background:"#2d6a4f",color:"#fff",padding:"14px 20px",borderRadius:10,marginBottom:20,display:"flex",alignItems:"center",gap:10}}>
                <Check size={20} /> <div><div style={{fontWeight:600}}>Proposal submitted!</div><div style={{fontSize:12,opacity:0.8}}>AI routed to: {CATEGORIES.find(c=>c.id===form.cat)?.label || "Working Group"} committee</div></div>
              </div>
            )}

            {/* AI Duplicate Warning */}
            {aiState.dupResult?.isDuplicate && (
              <div style={{background:"#fef3c7",border:"1px solid #fbbf24",padding:"12px 16px",borderRadius:10,marginBottom:16,display:"flex",gap:10,alignItems:"start"}}>
                <AlertTriangle size={18} style={{color:"#f59e0b",flexShrink:0,marginTop:2}} />
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#92400e"}}>⚠️ AI Similarity Detected ({aiState.dupResult.similarity}% match)</div>
                  <div style={{fontSize:12,color:"#78350f",marginTop:2}}>Similar to: "{aiState.dupResult.similar}" — consider merging or differentiating your proposal.</div>
                </div>
              </div>
            )}

            <div style={{marginBottom:18}}>
              <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:6}}>Project Title *</label>
              <input {...inp("title",{placeholder:"e.g., Solar street lights on Kattayad main road"})} />
            </div>

            <div style={{marginBottom:18}}>
              <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:6}}>Description *</label>
              <textarea {...inp("desc",{placeholder:"Describe the problem, who it affects, why this location needs this project...",rows:4,style:{resize:"vertical",lineHeight:1.6}})} />
            </div>

            {/* Category with AI auto-detect */}
            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540"}}>Category</label>
                <button onClick={handleAutoDetect} disabled={aiState.catLoading} style={{
                  background:"linear-gradient(90deg,#4361ee,#7c3aed)",color:"#fff",border:"none",
                  padding:"4px 12px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,
                  opacity:aiState.catLoading?0.7:1,
                }}>
                  {aiState.catLoading ? "Detecting…" : "✦ AI Auto-Detect"}
                </button>
              </div>
              <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:14,fontFamily:"inherit",background:"#fff"}}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
              {aiState.catSuggested && <div style={{fontSize:11,color:"#4361ee",marginTop:4}}>✦ AI suggested: {CATEGORIES.find(c=>c.id===aiState.catSuggested)?.label}</div>}
            </div>

            <div style={{display:"flex",gap:14,marginBottom:18,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:160}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:6}}>Your Ward *</label>
                <select value={form.ward} onChange={e=>setForm({...form,ward:e.target.value})} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:14,fontFamily:"inherit",background:"#fff"}}>
                  <option value="">Select ward</option>
                  {WARDS.map(w => <option key={w.n} value={w.n}>Ward {w.n} — {w.name}</option>)}
                </select>
              </div>
              <div style={{flex:1,minWidth:160}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:6}}>Beneficiary Type</label>
                <select value={form.benef} onChange={e=>setForm({...form,benef:e.target.value})} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:14,fontFamily:"inherit",background:"#fff"}}>
                  <option value="">Select beneficiaries</option>
                  {BENEFICIARY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div style={{display:"flex",gap:14,marginBottom:18,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:140}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:6}}>Estimated Cost</label>
                <input {...inp("cost",{placeholder:"e.g., ₹5,00,000"})} />
              </div>
              <div style={{flex:1,minWidth:160}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540",display:"block",marginBottom:6}}>Mobile Number (optional)</label>
                <input {...inp("mobile",{placeholder:"For follow-up by panchayat",type:"tel"})} />
              </div>
            </div>

            {/* Geo-tag */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <label style={{fontSize:12,fontWeight:600,color:"#4a4540"}}>📍 Pin Location on Map (optional)</label>
                <button onClick={() => setShowMapPin(!showMapPin)} style={{
                  background:showMapPin?"#1a3a2a":"#f0ebe1",color:showMapPin?"#f0d78c":"#4a4540",
                  border:"1px solid #d8d0c4",padding:"5px 12px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"inherit",
                }}>
                  {showMapPin ? "✓ Map Open" : "Open Map"}
                </button>
              </div>
              {pinLngLat && (
                <div style={{fontSize:12,color:"#2d6a4f",background:"#f0f5f2",padding:"6px 12px",borderRadius:8,marginBottom:8}}>
                  📌 Pinned at: {pinLngLat.lat}°N, {pinLngLat.lng}°E
                </div>
              )}
              {showMapPin && (
                <div style={{border:"2px dashed #2d6a4f",borderRadius:12,overflow:"hidden"}}>
                  <div style={{padding:"8px 12px",background:"#f0f5f2",fontSize:12,color:"#2d6a4f",fontWeight:600}}>🖱️ Click on the map to pin your proposal location</div>
                  <WardMap compact selectedWard={form.ward?parseInt(form.ward):null} onSelectWard={n=>setForm({...form,ward:String(n)})} pinMode={true} pins={pins} onAddPin={handleAddPin} onHoverWard={()=>{}} />
                </div>
              )}
            </div>

            {/* AI Duplicate Check Button */}
            <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
              <button onClick={handleDupCheck} disabled={!form.title||aiState.dupLoading} style={{
                background:"#f0ebe1",color:"#4a4540",border:"1px solid #d8d0c4",padding:"10px 18px",
                borderRadius:10,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit",
                opacity:(!form.title||aiState.dupLoading)?0.5:1,display:"flex",alignItems:"center",gap:6,
              }}>
                {aiState.dupLoading ? <><Activity size={14} className="spin" /> Checking…</> : <>✦ AI Duplicate Check</>}
              </button>
              {aiState.dupResult && !aiState.dupResult.isDuplicate && (
                <span style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#2d6a4f",fontWeight:600}}>
                  <Check size={16} /> No duplicates found
                </span>
              )}
            </div>

            <button onClick={handleSubmit} style={{background:"#2d6a4f",color:"#fff",border:"none",padding:"12px 28px",borderRadius:10,fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
              <Send size={16} /> Submit Proposal
            </button>
          </div>
        </div>

        <div style={{flex:1,minWidth:240}}>
          <div className="card fade-up-d1" style={{padding:"22px",background:"#faf5ea",marginBottom:14}}>
            <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#1a3a2a",margin:"0 0 12px"}}>🤖 AI Features</h3>
            {[{icon:"🧠",t:"Category Auto-Detect",d:"NLP scans your title/description and suggests the best category. One click to apply."},{icon:"🔍",t:"Duplicate Detection",d:"Compares against all existing proposals (cosine similarity). Flags similar submissions."},{icon:"📋",t:"Smart Routing",d:"AI routes approved proposals to the correct Standing Committee based on category & cost."},{icon:"📍",t:"Geo-Tagging",d:"Pin the exact location on the GIS map during submission for spatial planning."}].map((f,i) => (
              <div key={i} style={{display:"flex",gap:10,marginBottom:12,alignItems:"start"}}>
                <span style={{fontSize:18,flexShrink:0}}>{f.icon}</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1a3a2a"}}>{f.t}</div><div style={{fontSize:12,color:"#5a5550",lineHeight:1.5}}>{f.d}</div></div>
              </div>
            ))}
          </div>
          <div className="card fade-up-d2" style={{padding:"22px",background:"#f0f5f2"}}>
            <h3 style={{fontSize:14,fontWeight:700,color:"#2d6a4f",margin:"0 0 10px"}}>📊 Submissions So Far</h3>
            <div style={{fontSize:28,fontWeight:700,color:"#1a3a2a",fontFamily:"'DM Serif Display',serif"}}>47</div>
            <div style={{fontSize:12,color:"#6b6357"}}>from 18 of 24 wards</div>
            <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:6}}>
              {[["#606c38","🌾 14 Agri"],["#0077b6","💧 9 Water"],["#2d6a4f","🏗️ 8 Infra"],["#9b2226","👩 7 Women"]].map(([c,l],i) => (
                <span key={i} style={{background:c,color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:12,fontWeight:600}}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PHASE 3: FORUM ────────────────────────────────────────────────────────────
function DiscussPhase() {
  const [ideas, setIdeas] = useState(FORUM_IDEAS_INIT);
  const [expandedId, setExpandedId] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("popular");

  const vote = (id, dir) => setIdeas(ideas.map(i => i.id===id ? {...i, upvotes:i.upvotes+(dir==="up"?1:0), downvotes:i.downvotes+(dir==="down"?1:0)} : i));
  const addComment = (id) => {
    if (!newComment[id]?.trim()) return;
    setIdeas(ideas.map(i => i.id===id ? {...i, comments:[...i.comments,{author:"You",text:newComment[id],ts:"Just now"}]} : i));
    setNewComment({...newComment,[id]:""});
  };

  let filtered = filter==="all" ? ideas : ideas.filter(i=>i.cat===filter);
  if (sort==="popular") filtered = [...filtered].sort((a,b)=>(b.upvotes-b.downvotes)-(a.upvotes-a.downvotes));
  if (sort==="recent") filtered = [...filtered].sort((a,b)=>b.id-a.id);
  if (sort==="discussed") filtered = [...filtered].sort((a,b)=>b.comments.length-a.comments.length);

  return (
    <div>
      <SectionTitle sub="Read, discuss, and support ideas from fellow citizens.">Community Forum</SectionTitle>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:3,background:"#fff",borderRadius:8,padding:3,border:"1px solid #e0d8c8",flexWrap:"wrap"}}>
          {[{v:"all",l:"All"},{v:"agri",l:"🌾"},{v:"water",l:"💧"},{v:"infra",l:"🏗️"},{v:"women",l:"👩"},{v:"health",l:"🏥"},{v:"edu",l:"📚"},{v:"youth",l:"⚽"}].map(f => (
            <button key={f.v} onClick={()=>setFilter(f.v)} style={{padding:"5px 10px",borderRadius:6,border:"none",fontSize:12,cursor:"pointer",background:filter===f.v?"#2d6a4f":"transparent",color:filter===f.v?"#fff":"#6b6357",fontWeight:filter===f.v?600:400,fontFamily:"inherit"}}>{f.l}</button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #e0d8c8",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
          <option value="popular">Most Supported</option>
          <option value="recent">Most Recent</option>
          <option value="discussed">Most Discussed</option>
        </select>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(idea => {
          const expanded = expandedId===idea.id;
          return (
            <div key={idea.id} className="card" style={{padding:"20px 22px"}}>
              <div style={{display:"flex",gap:16}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:44}}>
                  <button onClick={()=>vote(idea.id,"up")} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:"#2d6a4f"}}><ThumbsUp size={18}/></button>
                  <span style={{fontWeight:700,fontSize:16,color:"#1a3a2a"}}>{idea.upvotes-idea.downvotes}</span>
                  <button onClick={()=>vote(idea.id,"down")} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:"#bc4749"}}><ThumbsDown size={18}/></button>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",gap:12}}>
                    <h3 style={{fontSize:16,fontWeight:700,color:"#1a3a2a",margin:"0 0 6px",lineHeight:1.3}}>{idea.title}</h3>
                    <CatBadge catId={idea.cat} />
                  </div>
                  <p style={{fontSize:13,color:"#5a5550",lineHeight:1.7,margin:"0 0 10px"}}>{idea.desc}</p>
                  <div style={{display:"flex",gap:16,alignItems:"center",fontSize:12,color:"#8a8070",flexWrap:"wrap"}}>
                    <span><strong>{idea.author}</strong></span>
                    <span>Ward {idea.ward}</span>
                    <span>{idea.ts}</span>
                    <button onClick={()=>setExpandedId(expanded?null:idea.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#2d6a4f",fontWeight:600,fontSize:12,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>
                      <MessageCircle size={14}/> {idea.comments.length} comments {expanded?<ChevronDown size={14}/>:<ChevronRight size={14}/>}
                    </button>
                  </div>
                  {expanded && (
                    <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid #ebe5d8"}}>
                      {idea.comments.map((c,ci) => (
                        <div key={ci} style={{padding:"10px 14px",background:"#faf8f2",borderRadius:8,marginBottom:8}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:12,fontWeight:600,color:"#1a3a2a"}}>{c.author}</span>
                            <span style={{fontSize:11,color:"#a09888"}}>{c.ts}</span>
                          </div>
                          <p style={{fontSize:13,color:"#4a4540",margin:0,lineHeight:1.6}}>{c.text}</p>
                        </div>
                      ))}
                      <div style={{display:"flex",gap:8,marginTop:8}}>
                        <input value={newComment[idea.id]||""} onChange={e=>setNewComment({...newComment,[idea.id]:e.target.value})} onKeyDown={e=>e.key==="Enter"&&addComment(idea.id)} placeholder="Add a comment..." style={{flex:1,padding:"8px 12px",borderRadius:8,border:"1px solid #d8d0c4",fontSize:13,fontFamily:"inherit"}} />
                        <button onClick={()=>addComment(idea.id)} style={{background:"#2d6a4f",color:"#fff",border:"none",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Post</button>
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

// ─── PHASE 4: WORKSHOPS (CALENDAR) ────────────────────────────────────────────
function DeliberatePhase() {
  const [viewMode, setViewMode] = useState("calendar");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const months = ["Sep","Oct","Nov","Dec","Jan","Feb"];
  const monthDates = {"Sep":9,"Oct":10,"Nov":11,"Dec":12,"Jan":1,"Feb":2};

  const getEventMonth = (event) => {
    const m = parseInt(event.date.split("-")[1]);
    return months.find(mn => monthDates[mn]===m) || months[0];
  };

  return (
    <div>
      <SectionTitle sub="Scheduled offline & hybrid sessions ensuring all citizens can participate.">Workshops & Participation Calendar</SectionTitle>

      {/* Context banner */}
      <div className="card fade-up" style={{padding:"20px 24px",marginBottom:20,background:"linear-gradient(135deg,#faf5ea,#f5efe2)",borderLeft:"5px solid #d4a843"}}>
        <p style={{fontSize:14,color:"#4a4540",lineHeight:1.8,margin:0}}>In Vellamunda — a tribal-majority GP in Wayanad with significant Paniya and Kuruma populations — digital access is uneven. The PB process is <strong>hybrid</strong>: online forums for connected citizens, and structured offline workshops for all others. Kerala's <strong>Ward Sabha (വാർഡ് സഭ)</strong> and <strong>Oorukoottam (ഊരുകൂട്ടം)</strong> mechanisms provide the institutional framework.</p>
      </div>

      {/* View toggle */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{v:"calendar",l:"📅 Timeline View"},{v:"list",l:"📋 List View"},{v:"map",l:"🗺️ Map View"}].map(v => (
          <button key={v.v} onClick={()=>setViewMode(v.v)} style={{padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,background:viewMode===v.v?"#1a3a2a":"#fff",color:viewMode===v.v?"#f0d78c":"#4a4540",border:"1px solid "+(viewMode===v.v?"#1a3a2a":"#e0d8c8"),fontWeight:viewMode===v.v?700:400}}>{v.l}</button>
        ))}
      </div>

      {viewMode==="calendar" && (
        <div className="fade-up">
          {/* Timeline */}
          <div className="card" style={{padding:"24px",marginBottom:20,overflowX:"auto"}}>
            <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 20px"}}>PB 2026-27 Schedule</h3>
            {/* Month headers */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:0,minWidth:600}}>
              {months.map(m => (
                <div key={m} style={{padding:"8px 0",textAlign:"center",fontSize:12,fontWeight:700,color:"#8a8070",borderBottom:"2px solid #e0d8c8"}}>{m} 2026{m==="Jan"||m==="Feb"?"–27":""}</div>
              ))}
            </div>
            {/* Events timeline */}
            <div style={{position:"relative",paddingTop:16,minWidth:600}}>
              {WORKSHOP_EVENTS.map((evt,i) => {
                const startM = parseInt(evt.date.split("-")[1]);
                const endM = parseInt(evt.endDate.split("-")[1]);
                const colStart = [9,10,11,12,1,2].indexOf(startM)+1;
                const colEnd = [9,10,11,12,1,2].indexOf(endM)+2;
                const top = i * 48;
                return (
                  <button key={evt.id} onClick={()=>setSelectedEvent(selectedEvent?.id===evt.id?null:evt)} style={{
                    position:"absolute",
                    left:`${(colStart-1)/6*100}%`,
                    width:`${(colEnd-colStart)/6*100-1}%`,
                    top:top,
                    background:selectedEvent?.id===evt.id?evt.color:evt.color+"22",
                    border:`2px solid ${evt.color}`,
                    borderRadius:8,padding:"6px 10px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",
                    transition:"all 0.2s",
                  }}>
                    <div style={{fontSize:12,fontWeight:700,color:selectedEvent?.id===evt.id?"#fff":evt.color,lineHeight:1.2}}>
                      {evt.icon} {evt.type}
                    </div>
                    <div style={{fontSize:10,color:selectedEvent?.id===evt.id?"rgba(255,255,255,0.8)":evt.color+"cc"}}>{evt.ward}</div>
                  </button>
                );
              })}
              <div style={{height:WORKSHOP_EVENTS.length*48+8}} />
            </div>
          </div>

          {/* Selected event detail */}
          {selectedEvent && (
            <div className="card fade-up" style={{padding:"24px",borderLeft:`5px solid ${selectedEvent.color}`,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
                <div>
                  <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#1a3a2a",margin:"0 0 4px"}}>{selectedEvent.icon} {selectedEvent.type}</h3>
                  <div style={{fontSize:12,color:"#8a8070"}}>{selectedEvent.date} → {selectedEvent.endDate}</div>
                </div>
                <button onClick={()=>setSelectedEvent(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#8a8070"}}><X size={18}/></button>
              </div>
              <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:6,alignItems:"center",fontSize:13,color:"#4a4540"}}>
                  <MapPin size={14} style={{color:selectedEvent.color}} /> {selectedEvent.location}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center",fontSize:13,color:"#4a4540"}}>
                  <Users size={14} style={{color:selectedEvent.color}} /> {selectedEvent.ward}
                </div>
              </div>
              <h4 style={{fontSize:13,fontWeight:700,color:"#1a3a2a",margin:"0 0 10px"}}>📋 Agenda</h4>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8}}>
                {selectedEvent.agenda.map((a,i) => (
                  <div key={i} style={{display:"flex",gap:8,alignItems:"start",padding:"8px 12px",background:"#faf8f2",borderRadius:8}}>
                    <span style={{fontSize:13,fontWeight:700,color:selectedEvent.color,flexShrink:0}}>{i+1}.</span>
                    <span style={{fontSize:13,color:"#4a4540",lineHeight:1.5}}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode==="list" && (
        <div className="fade-up" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>
          {WORKSHOP_EVENTS.map(evt => (
            <div key={evt.id} className="card" style={{padding:"20px",borderTop:`4px solid ${evt.color}`}}>
              <div style={{fontSize:28,marginBottom:8}}>{evt.icon}</div>
              <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 6px"}}>{evt.type}</h3>
              <div style={{fontSize:12,color:"#8a8070",marginBottom:8}}>{evt.date}</div>
              <div style={{fontSize:12,color:"#4a4540",marginBottom:8}}><MapPin size={12} style={{verticalAlign:"middle",marginRight:4}}/>{evt.location}</div>
              <div style={{fontSize:12,color:"#4a4540",marginBottom:12}}><Users size={12} style={{verticalAlign:"middle",marginRight:4}}/>{evt.ward}</div>
              <div style={{fontSize:11,fontWeight:600,color:evt.color,marginBottom:4}}>Agenda:</div>
              {evt.agenda.slice(0,2).map((a,i) => (
                <div key={i} style={{fontSize:12,color:"#5a5550",padding:"4px 0",borderTop:"1px solid #f0ebe1"}}>• {a}</div>
              ))}
              {evt.agenda.length>2 && <div style={{fontSize:11,color:"#a09888",marginTop:4}}>+{evt.agenda.length-2} more items</div>}
            </div>
          ))}
        </div>
      )}

      {viewMode==="map" && (
        <div className="fade-up">
          <div className="card" style={{padding:"16px",marginBottom:16}}>
            <WardMap compact onSelectWard={()=>{}} onHoverWard={()=>{}} />
            <div style={{padding:"12px 0 0",display:"flex",flexWrap:"wrap",gap:8}}>
              {[{c:"#2d6a4f",l:"Ward Sabha (All wards)"},{c:"#774936",l:"Oorukoottam (Tribal wards)"},{c:"#9b2226",l:"Women's Sabha"},{c:"#4361ee",l:"Pre-ballot sessions"}].map((lg,i) => (
                <div key={i} style={{display:"flex",gap:6,alignItems:"center",fontSize:12}}>
                  <div style={{width:12,height:12,borderRadius:3,background:lg.c}} />
                  <span style={{color:"#4a4540"}}>{lg.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Accessibility facilities */}
      <div className="card fade-up-d2" style={{padding:"22px",background:"#f0f5f2",marginTop:16}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#2d6a4f",margin:"0 0 12px"}}>🌍 Accessibility & Inclusion Provisions</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
          {["Akshaya Common Service Centres for digital ballot access in all wards","Multilingual facilitators: Malayalam, Paniya, Kuruma languages","Paper ballot option at Panchayat office for non-smartphone users","Transport arranged from remote ST/SC settlements to ward venues","Childcare / crèche at all deliberation events","Audio/visual materials for low-literacy participants","Home visits for bedridden and homebound citizens"].map((f,i) => (
            <div key={i} style={{display:"flex",gap:8,alignItems:"start"}}>
              <Check size={15} style={{color:"#2d6a4f",flexShrink:0,marginTop:2}}/>
              <span style={{fontSize:13,color:"#4a4540",lineHeight:1.5}}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PHASE 5: REVIEW ───────────────────────────────────────────────────────────
function DevelopPhase() {
  const pipeline = [
    {stage:"Submitted",count:47,color:"#a09888",desc:"Raw citizen ideas from forum and ward sabhas"},
    {stage:"AI-Screened",count:44,color:"#7c3aed",desc:"AI duplicate detection removed 3 near-duplicates"},
    {stage:"Reviewed",count:38,color:"#d4a843",desc:"Working Group assessed feasibility, legality, overlap"},
    {stage:"Costed",count:32,color:"#e76f51",desc:"AE / Agriculture Officer prepared cost estimates"},
    {stage:"Ballot-Ready",count:28,color:"#2d6a4f",desc:"Final proposals approved for citizen ballot"},
  ];
  return (
    <div>
      <SectionTitle sub="AI pre-screens for duplicates; Working Groups review feasibility, cost, and legal compliance.">Expert Vetting & Proposal Pipeline</SectionTitle>
      <div className="card fade-up" style={{padding:"28px",marginBottom:20}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 18px"}}>Proposal Pipeline</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {pipeline.map((s,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:110,fontSize:13,fontWeight:600,color:s.color,textAlign:"right",display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
                {s.stage==="AI-Screened"&&<span style={{fontSize:9,background:"#7c3aed20",color:"#7c3aed",padding:"2px 5px",borderRadius:4,fontWeight:700}}>✦ AI</span>}
                {s.stage}
              </div>
              <div style={{flex:1,position:"relative",height:34,background:"#f0ebe1",borderRadius:8,overflow:"hidden"}}>
                <div style={{width:`${(s.count/47)*100}%`,height:"100%",background:s.color,borderRadius:8,transition:"width 0.6s ease",display:"flex",alignItems:"center",paddingLeft:12}}>
                  <span style={{color:"#fff",fontSize:13,fontWeight:700}}>{s.count}</span>
                </div>
              </div>
              <div style={{width:220,fontSize:12,color:"#6b6357"}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="fade-up-d1" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14,marginBottom:20}}>
        {[{t:"Technical Feasibility",i:"🔧",who:"Assistant Engineer",checks:["Engineering assessment","Site inspection","Materials availability","Environmental review"]},{t:"Financial Viability",i:"💰",who:"Accounts Officer",checks:["Cost estimation","Budget source (Gen/SCP/TSP)","Multi-year check","No duplication"]},{t:"Legal & Policy",i:"⚖️",who:"Secretary",checks:["Kerala PRIs Act compliance","No land encroachment","Permits obtainable","XV Finance Commission norms"]},{t:"AI Deduplication",i:"✦",who:"Claude AI Model",checks:["Semantic similarity check","Cosine similarity >70% flagged","Cross-ward duplicate detection","Cluster merging suggestions"]}].map((v,i) => (
          <div key={i} className="card" style={{padding:"20px",borderTop:`3px solid ${i===3?"#7c3aed":"#d4a843"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:22}}>{v.i}</span>
              <div><div style={{fontSize:14,fontWeight:700,color:"#1a3a2a"}}>{v.t}</div><div style={{fontSize:11,color:"#8a8070"}}>{v.who}</div></div>
            </div>
            {v.checks.map((c,ci) => (
              <div key={ci} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                <Check size={14} style={{color:i===3?"#7c3aed":"#2d6a4f",flexShrink:0}}/><span style={{fontSize:12,color:"#4a4540"}}>{c}</span>
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
  const [ward, setWard] = useState(null);
  const [gpVotes, setGpVotes] = useState(new Set());
  const [wardVotes, setWardVotes] = useState(new Set());
  const [ballotSubmitted, setBallotSubmitted] = useState(false);
  const GP_BUDGET = 29411300, WARD_BUDGET = 1225695, MAX_GP = 8, MAX_WARD = 4;
  const toggleGp = (id) => { const n=new Set(gpVotes); n.has(id)?n.delete(id):n.size<MAX_GP&&n.add(id); setGpVotes(n); };
  const toggleWard = (id) => { const n=new Set(wardVotes); n.has(id)?n.delete(id):n.size<MAX_WARD&&n.add(id); setWardVotes(n); };
  const gpCost = [...gpVotes].reduce((s,id)=>s+(GP_BALLOT.find(x=>x.id===id)?.cost||0),0);
  const wardItems = ward ? (WARD_BALLOT_SAMPLES[ward]||[]) : [];
  const wardCost = [...wardVotes].reduce((s,id)=>s+(wardItems.find(x=>x.id===id)?.cost||0),0);
  if (ballotSubmitted) return (
    <div><SectionTitle>Ballot Submitted!</SectionTitle>
      <div className="card fade-up" style={{padding:"48px 32px",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>🗳️</div>
        <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"#2d6a4f",margin:"0 0 12px"}}>Thank you for voting!</h3>
        <p style={{fontSize:14,color:"#6b6357",maxWidth:400,margin:"0 auto 20px",lineHeight:1.7}}>Your ballot is recorded. You approved <strong>{gpVotes.size} GP-wide</strong> and <strong>{wardVotes.size} ward-level</strong> projects. Aggregation uses the <strong>Method of Equal Shares</strong>.</p>
        <button onClick={()=>{setBallotSubmitted(false);setGpVotes(new Set());setWardVotes(new Set());}} style={{background:"#2d6a4f",color:"#fff",border:"none",padding:"10px 24px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View Results →</button>
      </div>
    </div>
  );
  return (
    <div>
      <SectionTitle sub="Approval ballot — select ALL projects you support. No ranking needed.">Cast Your Vote</SectionTitle>
      {!ward ? (
        <div className="card fade-up" style={{padding:"32px",textAlign:"center"}}>
          <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#1a3a2a",margin:"0 0 12px"}}>🗺️ Select Your Ward</h3>
          <p style={{fontSize:13,color:"#6b6357",marginBottom:20}}>You'll see GP-wide projects (all voters) and your ward's specific ballot.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,maxWidth:700,margin:"0 auto"}}>
            {WARDS.map(w => (
              <button key={w.n} onClick={()=>setWard(w.n)} style={{padding:"10px 8px",border:"1px solid #d8d0c4",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:12,fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}}>
                <span style={{background:"#2d6a4f",color:"#fff",borderRadius:6,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{w.n}</span>{w.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <Badge color="#2d6a4f">Ward {ward} — {WARDS.find(w=>w.n===ward)?.name}</Badge>
            <button onClick={()=>{setWard(null);setWardVotes(new Set());}} style={{background:"none",border:"1px solid #d8d0c4",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit",color:"#6b6357"}}>Change Ward</button>
          </div>
          <div className="fade-up" style={{marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#1a3a2a",margin:0}}>🏛️ GP-Wide Projects <span style={{fontSize:13,fontWeight:400,color:"#8a8070"}}>(up to {MAX_GP})</span></h3>
              <span style={{fontSize:13,fontWeight:600,color:gpVotes.size>=MAX_GP?"#bc4749":"#2d6a4f"}}>{gpVotes.size}/{MAX_GP}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {GP_BALLOT.map(p => {
                const sel=gpVotes.has(p.id);
                return (
                  <button key={p.id} onClick={()=>toggleGp(p.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:sel?"#e8f5e9":"#fff",border:sel?"2px solid #2d6a4f":"1px solid #e0d8c8",borderRadius:10,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s"}}>
                    <div style={{width:22,height:22,borderRadius:6,border:sel?"2px solid #2d6a4f":"2px solid #c8c0b0",background:sel?"#2d6a4f":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel&&<Check size={14} color="#fff"/>}</div>
                    <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#1a3a2a"}}>{p.title}</div><div style={{fontSize:11,color:"#8a8070",marginTop:2}}>{p.benef} • {p.mal}</div></div>
                    <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:13,fontWeight:700,color:"#1a3a2a"}}>{fmt(p.cost)}</div><CatBadge catId={p.cat}/></div>
                  </button>
                );
              })}
            </div>
          </div>
          {wardItems.length>0&&(
            <div className="fade-up-d1" style={{marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#1a3a2a",margin:0}}>📍 Ward {ward} Projects <span style={{fontSize:13,fontWeight:400,color:"#8a8070"}}>(up to {MAX_WARD})</span></h3>
                <span style={{fontSize:13,fontWeight:600,color:wardVotes.size>=MAX_WARD?"#bc4749":"#2d6a4f"}}>{wardVotes.size}/{MAX_WARD}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {wardItems.map(p=>{const sel=wardVotes.has(p.id);return(
                  <button key={p.id} onClick={()=>toggleWard(p.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:sel?"#e3f2fd":"#fff",border:sel?"2px solid #0077b6":"1px solid #e0d8c8",borderRadius:10,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s"}}>
                    <div style={{width:22,height:22,borderRadius:6,border:sel?"2px solid #0077b6":"2px solid #c8c0b0",background:sel?"#0077b6":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel&&<Check size={14} color="#fff"/>}</div>
                    <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#1a3a2a"}}>{p.title}</div></div>
                    <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:13,fontWeight:700,color:"#1a3a2a"}}>{fmt(p.cost)}</div><CatBadge catId={p.cat}/></div>
                  </button>
                );})}
              </div>
            </div>
          )}
          {(gpVotes.size>0||wardVotes.size>0)&&(
            <div className="card" style={{padding:"20px 24px",position:"sticky",bottom:16,boxShadow:"0 -2px 16px rgba(0,0,0,0.1)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><span style={{fontSize:14,fontWeight:600,color:"#1a3a2a"}}>{gpVotes.size+wardVotes.size} selected</span><span style={{fontSize:12,color:"#8a8070",marginLeft:12}}>GP: {fmt(gpCost)} • Ward: {fmt(wardCost)}</span></div>
                <button onClick={()=>setBallotSubmitted(true)} style={{background:"#2d6a4f",color:"#fff",border:"none",padding:"12px 32px",borderRadius:10,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>Submit Ballot <Send size={16}/></button>
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
  const compData = RESULTS_DATA.map(d=>({name:d.pool,"MES":d.mes,"Greedy":d.greedy,"Diff":d.diff}));
  const catBreakdown = [
    {name:"Agriculture",mes:42,greedy:58},{name:"Infrastructure",mes:28,greedy:22},
    {name:"Women",mes:18,greedy:14},{name:"Education",mes:15,greedy:12},
    {name:"Health",mes:12,greedy:14},{name:"Elderly",mes:8,greedy:6},
    {name:"Water/San",mes:10,greedy:16},{name:"Youth",mes:6,greedy:8},
  ];
  const welfareData = [
    {name:"Utilitarian",value:8820000,desc:"Max total approvals × cost"},
    {name:"Nash Product",value:6940000,desc:"Max log-sum of utilities"},
    {name:"Egalitarian",value:4610000,desc:"Max min-utility (worst-off)"},
  ];
  return (
    <div>
      <SectionTitle sub="How MES vs Greedy compare across welfare criteria: Utilitarian, Nash, Egalitarian.">Aggregation Results</SectionTitle>
      <div className="card fade-up" style={{padding:"28px 32px",marginBottom:24,background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{fontSize:36,fontFamily:"'DM Serif Display',serif",color:"#f0d78c"}}>63</div>
          <div><div style={{fontSize:16,fontWeight:700}}>Projects where MES and Greedy disagree</div><div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>across all 7 ballot pools — the "proportional fairness signature"</div></div>
        </div>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.8)",lineHeight:1.7,margin:0}}>
          <strong style={{color:"#f0d78c"}}>Method of Equal Shares</strong> gives every voter an equal ₹ share and funds projects whose supporters can collectively afford them. <strong style={{color:"#f0d78c"}}>Greedy</strong> maximises approvals-per-rupee — popular but unfair to minorities. The 63 disagreements reveal cohesive groups protected by MES but ignored by Greedy.
        </p>
      </div>
      <div className="two-col" style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
        <div className="card fade-up" style={{flex:1.5,padding:"24px",minWidth:280}}>
          <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 16px"}}>Items Selected by Pool</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={compData} margin={{top:5,right:10,left:0,bottom:5}}>
              <XAxis dataKey="name" tick={{fontSize:10,fill:"#6b6357"}} angle={-20} textAnchor="end" height={50}/>
              <YAxis tick={{fontSize:11,fill:"#6b6357"}}/>
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e0d8c8",fontSize:12}}/>
              <Bar dataKey="MES" fill="#2d6a4f" radius={[4,4,0,0]}/>
              <Bar dataKey="Greedy" fill="#d4a843" radius={[4,4,0,0]}/>
              <Bar dataKey="Diff" fill="#bc4749" radius={[4,4,0,0]}/>
              <Legend wrapperStyle={{fontSize:12}}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card fade-up-d1" style={{flex:1,padding:"24px",minWidth:240}}>
          <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 16px"}}>Welfare Criteria</h3>
          {welfareData.map((w,i) => (
            <div key={i} style={{marginBottom:16,padding:"14px",background:i===0?"#faf5ea":i===1?"#f0f5f2":"#faf0f0",borderRadius:10,borderLeft:`4px solid ${i===0?"#d4a843":i===1?"#2d6a4f":"#bc4749"}`}}>
              <div style={{fontSize:14,fontWeight:700,color:"#1a3a2a"}}>{w.name}</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:i===0?"#d4a843":i===1?"#2d6a4f":"#bc4749",margin:"4px 0"}}>{fmt(w.value)}</div>
              <div style={{fontSize:11,color:"#8a8070"}}>{w.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card fade-up-d2" style={{padding:"24px"}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 14px"}}>Spending by Category (₹ Lakhs) — MES vs Greedy</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={catBreakdown} layout="vertical" margin={{top:0,right:10,left:10,bottom:0}}>
            <XAxis type="number" tick={{fontSize:11,fill:"#6b6357"}}/>
            <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:"#6b6357"}} width={80}/>
            <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e0d8c8",fontSize:12}}/>
            <Bar dataKey="mes" name="MES" fill="#2d6a4f" radius={[0,4,4,0]} barSize={10}/>
            <Bar dataKey="greedy" name="Greedy" fill="#d4a843" radius={[0,4,4,0]} barSize={10}/>
            <Legend wrapperStyle={{fontSize:12}}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── PHASE 8: DATA & INSIGHTS ──────────────────────────────────────────────────
function DataPhase() {
  const [activeTab, setActiveTab] = useState("deficit");
  const [weights, setWeights] = useState({infra:30,hazard:20,popPressure:10,socialVuln:25,accessDef:15});
  const [highlightLayer, setHighlightLayer] = useState("composite");
  const [selectedWard, setSelectedWard] = useState(null);

  const TOTAL_WARD_BUDGET = 29400000; // ~₹2.94 Cr for ward pool
  const BASE_SHARE = 0.40;

  const computeAllocation = useCallback(() => {
    const scores = Object.entries(WARD_DEFICIT).map(([wardNo, d]) => {
      const composite = (
        d.infra * weights.infra / 100 +
        d.hazard * weights.hazard / 100 +
        d.popPressure * weights.popPressure / 100 +
        d.socialVuln * weights.socialVuln / 100 +
        d.accessDef * weights.accessDef / 100
      );
      return {wardNo:parseInt(wardNo), composite, name: WARDS.find(w=>w.n===parseInt(wardNo))?.name};
    });
    const totalScore = scores.reduce((s,x)=>s+x.composite,0);
    const basePer = (TOTAL_WARD_BUDGET * BASE_SHARE) / 24;
    const needPool = TOTAL_WARD_BUDGET * (1 - BASE_SHARE);
    return scores.map(s => ({
      ...s,
      base: basePer,
      need: (s.composite / totalScore) * needPool,
      total: basePer + (s.composite / totalScore) * needPool,
    })).sort((a,b)=>b.total-a.total);
  }, [weights]);

  const allocations = useMemo(() => computeAllocation(), [computeAllocation]);
  const equalShare = TOTAL_WARD_BUDGET / 24;

  const tabs = [
    {id:"deficit",l:"📊 Deficit Index"},
    {id:"allocation",l:"💰 Fund Allocation"},
    {id:"news",l:"📰 Evidence & Data"},
  ];

  const adjustWeight = (key, delta) => {
    const curr = weights[key];
    const newVal = Math.max(0, Math.min(70, curr + delta));
    const diff = newVal - curr;
    const others = Object.keys(weights).filter(k=>k!==key);
    const totalOthers = others.reduce((s,k)=>s+weights[k],0);
    if (totalOthers === 0 && diff < 0) return;
    const newWeights = {...weights, [key]:newVal};
    let remaining = 100 - newVal;
    if (remaining < 0) remaining = 0;
    const ratio = totalOthers > 0 ? remaining / totalOthers : 0;
    others.forEach(k => { newWeights[k] = Math.max(0, Math.round(weights[k] * ratio)); });
    const sum = Object.values(newWeights).reduce((s,v)=>s+v,0);
    if (sum !== 100) newWeights[others[others.length-1]] += (100 - sum);
    setWeights(newWeights);
  };

  const deficitDims = [
    {key:"infra",label:"Infrastructure Deficit",subKeys:["Roads","Drainage","Water supply","Waste mgmt","Lighting"]},
    {key:"hazard",label:"Hazard Exposure",subKeys:["Flood zones","Landslide risk","Building vulnerability","Erosion","Infrastructure damage"]},
    {key:"popPressure",label:"Population Pressure",subKeys:["Density","Building density","Built-up cover","Land use","Growth rate"]},
    {key:"socialVuln",label:"Social Vulnerability",subKeys:["BPL households","SC/ST population","Slum areas","Elderly","Single women"]},
    {key:"accessDef",label:"Accessibility Deficit",subKeys:["Health centre","School","Anganwadi","Market","Bus stop"]},
  ];

  const newsItems = [
    {title:"Kerala GSDP growth and Wayanad planning priorities",source:"Kerala Economic Review 2025",tag:"Macro Context",date:"Mar 2025",desc:"Wayanad remains among Kerala's three most vulnerable districts. The post-2018 flood recovery is ongoing, with infrastructure deficit in tribal taluks estimated at 40% above state average."},
    {title:"Method of Equal Shares: Academic Literature",source:"Lackner & Peters (2023), EC Conference",tag:"Voting Theory",date:"Jun 2023",desc:"EJR guarantee is mathematically proven for MES when ballot is approval-based. Extended Justified Representation ensures no group of k voters deserving k × (budget/n) is ignored."},
    {title:"K-SMART Panchayat Data Portal — Vellamunda",source:"LSGD Kerala / K-SMART",tag:"Local Data",date:"2024-25",desc:"Road condition scores (R-TACK), infrastructure gap indices, and ward-level project histories available. 38 of 208 projects from 2023-24 show completion delays."},
    {title:"Tribal sub-plan (TSP) fund utilisation gap",source:"ST Development Department, Kerala",tag:"Equity",date:"2024",desc:"Vellamunda GP's TSP utilisation was 71% in 2023-24 — below the 90% target. Identification of eligible beneficiaries in remote hamlets is the main bottleneck."},
    {title:"Participatory budgeting and welfare outcomes",source:"Wampler et al (2021), APSA",tag:"Evidence",date:"2021",desc:"Meta-analysis of 120 PB programs shows 23% higher infrastructure investment reach in previously-excluded communities vs non-PB comparators."},
  ];

  return (
    <div>
      <SectionTitle sub="Ward-level deficit indices, deficit-based fund allocation with adjustable weights, and contextual evidence.">Data & Insights</SectionTitle>

      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:"8px 18px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:"inherit",background:activeTab===t.id?"#1a3a2a":"#fff",color:activeTab===t.id?"#f0d78c":"#4a4540",border:"1px solid "+(activeTab===t.id?"#1a3a2a":"#e0d8c8"),fontWeight:activeTab===t.id?700:400,transition:"all 0.2s"}}>{t.l}</button>
        ))}
      </div>

      {activeTab==="deficit" && (
        <div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:20}}>
            <div style={{flex:2,minWidth:280}}>
              <div className="card fade-up" style={{padding:"16px",marginBottom:12}}>
                <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                  {[{id:"composite",l:"Composite"},{id:"infra",l:"Infrastructure"},{id:"hazard",l:"Hazard"},{id:"social",l:"Social Vuln"},{id:"access",l:"Accessibility"}].map(l => (
                    <button key={l.id} onClick={()=>setHighlightLayer(l.id)} style={{padding:"4px 10px",borderRadius:12,fontSize:11,cursor:"pointer",fontFamily:"inherit",background:highlightLayer===l.id?"#1a3a2a":"#f0ebe1",color:highlightLayer===l.id?"#f0d78c":"#4a4540",border:"none",fontWeight:highlightLayer===l.id?700:400}}>{l.l}</button>
                  ))}
                </div>
                <WardMap selectedWard={selectedWard} onSelectWard={setSelectedWard} onHoverWard={()=>{}} highlightLayer={highlightLayer==="composite"?null:highlightLayer} compact />
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,fontSize:11,color:"#8a8070"}}>
                  <span>Low deficit</span>
                  <div style={{flex:1,height:6,background:"linear-gradient(90deg,#f0e6d0,#ff6464)",borderRadius:4}} />
                  <span>High deficit</span>
                </div>
              </div>
            </div>
            <div style={{flex:1,minWidth:240}}>
              <div className="card fade-up-d1" style={{padding:"20px"}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#1a3a2a",margin:"0 0 14px"}}>🔴 Highest Deficit Wards</h3>
                {Object.entries(WARD_DEFICIT)
                  .map(([wn,d]) => ({wn:parseInt(wn),score:Math.round((d.infra*0.3+d.hazard*0.2+d.socialVuln*0.25+d.accessDef*0.15+d.popPressure*0.1))}))
                  .sort((a,b)=>b.score-a.score).slice(0,8)
                  .map((item,i) => {
                    const wn = item.wn;
                    const name = WARDS.find(w=>w.n===wn)?.name;
                    return (
                      <div key={wn} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <span style={{fontSize:11,fontWeight:700,color:"#8a8070",width:16}}>{i+1}</span>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                            <span style={{fontSize:12,fontWeight:600,color:"#1a3a2a"}}>Ward {wn} — {name}</span>
                            <span style={{fontSize:12,fontWeight:700,color:item.score>65?"#bc4749":"#d4a843"}}>{item.score}</span>
                          </div>
                          <div style={{height:4,background:"#f0ebe1",borderRadius:4,overflow:"hidden"}}>
                            <div style={{width:`${item.score}%`,height:"100%",background:item.score>65?"#bc4749":"#d4a843"}} />
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>

          {/* Dimension breakdown */}
          <div className="card fade-up-d2" style={{padding:"24px"}}>
            <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 16px"}}>Deficit Dimensions Explained</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
              {deficitDims.map((d,i) => (
                <div key={d.key} style={{padding:"16px",background:"#faf8f2",borderRadius:10,borderTop:`3px solid ${["#2d6a4f","#bc4749","#0077b6","#9b2226","#d4a843"][i]}`}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1a3a2a",marginBottom:8}}>{d.label}</div>
                  {d.subKeys.map((sk,j) => (
                    <div key={j} style={{display:"flex",gap:6,alignItems:"center",marginBottom:4,fontSize:12,color:"#5a5550"}}>
                      <Check size={12} style={{color:["#2d6a4f","#bc4749","#0077b6","#9b2226","#d4a843"][i],flexShrink:0}}/>{sk}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab==="allocation" && (
        <div>
          <div style={{display:"flex",gap:20,marginBottom:20,flexWrap:"wrap"}}>
            {/* Weight sliders */}
            <div className="card fade-up" style={{flex:1,minWidth:280,padding:"24px"}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 6px"}}>⚖️ Adjust Allocation Weights</h3>
              <p style={{fontSize:12,color:"#8a8070",margin:"0 0 18px",lineHeight:1.5}}>Weights determine how the need-based 60% of ward funds is distributed. Equal split (40%) is guaranteed regardless.</p>
              {[
                {key:"infra",label:"Infrastructure Deficit",color:"#2d6a4f",icon:"🏗️"},
                {key:"hazard",label:"Hazard Exposure",color:"#bc4749",icon:"⚠️"},
                {key:"popPressure",label:"Population Pressure",color:"#0077b6",icon:"📈"},
                {key:"socialVuln",label:"Social Vulnerability",color:"#9b2226",icon:"👥"},
                {key:"accessDef",label:"Accessibility Deficit",color:"#d4a843",icon:"🏥"},
              ].map(w => (
                <div key={w.key} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:13,color:"#4a4540",fontWeight:600}}>{w.icon} {w.label}</span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <button onClick={()=>adjustWeight(w.key,-5)} style={{width:22,height:22,borderRadius:4,border:"1px solid #d8d0c4",background:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{fontSize:14,fontWeight:700,color:w.color,width:32,textAlign:"center"}}>{weights[w.key]}%</span>
                      <button onClick={()=>adjustWeight(w.key,5)} style={{width:22,height:22,borderRadius:4,border:"1px solid #d8d0c4",background:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </div>
                  <div style={{height:6,background:"#f0ebe1",borderRadius:4,overflow:"hidden"}}>
                    <div style={{width:`${weights[w.key]}%`,height:"100%",background:w.color,transition:"width 0.3s ease"}} />
                  </div>
                </div>
              ))}
              <div style={{padding:"12px",background:"#f0f5f2",borderRadius:8,fontSize:12,color:"#2d6a4f",fontWeight:600,textAlign:"center"}}>Total: {Object.values(weights).reduce((s,v)=>s+v,0)}% ✓</div>
            </div>

            {/* Allocation chart */}
            <div className="card fade-up-d1" style={{flex:2,minWidth:320,padding:"24px"}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:"0 0 4px"}}>Resulting Ward Allocation</h3>
              <p style={{fontSize:12,color:"#8a8070",margin:"0 0 16px"}}>Dashed line = equal share (₹{fmt(equalShare)} per ward)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={allocations.slice(0,12)} margin={{top:5,right:10,left:0,bottom:40}}>
                  <XAxis dataKey="wardNo" tickFormatter={v=>`W${v}`} tick={{fontSize:10,fill:"#6b6357"}} angle={-40} textAnchor="end" height={50}/>
                  <YAxis tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`} tick={{fontSize:10,fill:"#6b6357"}}/>
                  <Tooltip formatter={(val)=>[fmt(val),"Allocation"]} labelFormatter={l=>`Ward ${l}`} contentStyle={{borderRadius:8,fontSize:12}}/>
                  <Bar dataKey="total" fill="#2d6a4f" radius={[4,4,0,0]}>
                    {allocations.slice(0,12).map((a,i) => (
                      <Cell key={i} fill={a.total>equalShare*1.3?"#bc4749":a.total>equalShare*1.1?"#d4a843":"#2d6a4f"}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
                {[["#bc4749","High need (>130% equal)"],["#d4a843","Above average (110-130%)"],["#2d6a4f","Near/below average (<110%)"]].map(([c,l],i)=>(
                  <div key={i} style={{display:"flex",gap:5,alignItems:"center",fontSize:11,color:"#6b6357"}}>
                    <div style={{width:10,height:10,borderRadius:2,background:c}}/>{l}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top/bottom wards table */}
          <div className="card fade-up-d2" style={{padding:"20px"}}>
            <h3 style={{fontSize:14,fontWeight:700,color:"#1a3a2a",margin:"0 0 14px"}}>Allocation Comparison (Equal vs Deficit-Based)</h3>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{borderBottom:"2px solid #e0d8c8"}}>
                    {["Ward","Name","Composite Index","Equal Share","Deficit-Based","Difference"].map(h=>(
                      <th key={h} style={{padding:"8px 12px",textAlign:h==="Ward"||h==="Composite Index"?"center":"left",color:"#6b6357",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allocations.slice(0,10).map((a,i)=>(
                    <tr key={a.wardNo} style={{borderBottom:"1px solid #f0ebe1",background:i%2===0?"#fff":"#faf8f4"}}>
                      <td style={{padding:"8px 12px",textAlign:"center",fontWeight:700,color:"#1a3a2a"}}>{a.wardNo}</td>
                      <td style={{padding:"8px 12px",color:"#3a3530"}}>{a.name}</td>
                      <td style={{padding:"8px 12px",textAlign:"center"}}>
                        <div style={{display:"inline-flex",alignItems:"center",gap:6}}>
                          <div style={{width:40,height:6,background:"#f0ebe1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${a.composite}%`,height:"100%",background:a.composite>60?"#bc4749":"#d4a843"}}/></div>
                          <span style={{fontWeight:700,color:a.composite>60?"#bc4749":"#d4a843"}}>{a.composite.toFixed(0)}</span>
                        </div>
                      </td>
                      <td style={{padding:"8px 12px",color:"#6b6357"}}>{fmt(equalShare)}</td>
                      <td style={{padding:"8px 12px",fontWeight:600,color:"#1a3a2a"}}>{fmt(a.total)}</td>
                      <td style={{padding:"8px 12px",fontWeight:700,color:a.total>equalShare?"#2d6a4f":"#bc4749"}}>
                        {a.total>equalShare?"+":""}{fmt(a.total-equalShare)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab==="news" && (
        <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:14}}>
          {newsItems.map((n,i) => (
            <div key={i} className="card" style={{padding:"20px 24px",borderLeft:`4px solid ${["#d4a843","#4361ee","#2d6a4f","#774936","#0077b6"][i]}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:8,flexWrap:"wrap",gap:8}}>
                <h3 style={{fontSize:15,fontWeight:700,color:"#1a3a2a",margin:0,flex:1}}>{n.title}</h3>
                <span style={{background:`${["#d4a843","#4361ee","#2d6a4f","#774936","#0077b6"][i]}22`,color:["#d4a843","#4361ee","#2d6a4f","#774936","#0077b6"][i],fontSize:11,padding:"3px 10px",borderRadius:10,fontWeight:600,flexShrink:0}}>{n.tag}</span>
              </div>
              <p style={{fontSize:13,color:"#5a5550",lineHeight:1.7,margin:"0 0 10px"}}>{n.desc}</p>
              <div style={{fontSize:11,color:"#a09888"}}>{n.source} · {n.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState(0);
  const [animIn, setAnimIn] = useState(true);

  const switchPhase = (p) => {
    setAnimIn(false);
    setTimeout(() => { setPhase(p); setAnimIn(true); }, 150);
  };

  const phaseComponents = [WelcomePhase, MapPhase, IdeatePhase, DiscussPhase, DeliberatePhase, DevelopPhase, VotePhase, ResultsPhase, DataPhase];
  const PhaseComp = phaseComponents[phase];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(175deg,#f0ebe1 0%,#e8e2d6 40%,#f5f0e6 100%)",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1a1a1a"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=DM+Serif+Display&display=swap" rel="stylesheet"/>

      <header style={{background:"linear-gradient(135deg,#1a3a2a 0%,#2d6a4f 60%,#40916c 100%)",padding:"14px 20px 10px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,0.15)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <h1 style={{fontFamily:"'DM Serif Display',serif",color:"#f0d78c",fontSize:20,margin:0,letterSpacing:0.5}}>ജനകീയാസൂത്രണം</h1>
              <p style={{color:"rgba(255,255,255,0.65)",fontSize:10,margin:"2px 0 0",letterSpacing:0.8}}>VELLAMUNDA GRAMA PANCHAYAT • PARTICIPATORY BUDGETING 2026-27</p>
            </div>
            <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{background:"rgba(255,255,255,0.15)",color:"#f0d78c",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>24 WARDS</span>
              <span style={{background:"rgba(255,255,255,0.15)",color:"#f0d78c",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>₹25.41 Cr</span>
              <span style={{background:"rgba(240,215,140,0.25)",color:"#f0d78c",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>✦ AI-Assisted</span>
            </div>
          </div>
          <div style={{display:"flex",gap:2,overflowX:"auto",paddingBottom:2}}>
            {PHASES.map((p,i) => {
              const Icon = p.icon;
              const active = phase===i;
              return (
                <button key={i} onClick={()=>switchPhase(i)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 11px",background:active?"rgba(255,255,255,0.2)":"transparent",border:active?"1px solid rgba(240,215,140,0.4)":"1px solid transparent",borderRadius:8,color:active?"#f0d78c":"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:11,fontWeight:active?700:500,transition:"all 0.2s",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"}}>
                  <Icon size={13}/><span className="phase-label">{p.short}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px 60px",opacity:animIn?1:0,transform:animIn?"translateY(0)":"translateY(8px)",transition:"all 0.2s ease"}}>
        <PhaseComp onNext={()=>switchPhase(1)}/>
      </main>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.45s ease both}
        .fade-up-d1{animation:fadeUp 0.45s ease 0.08s both}
        .fade-up-d2{animation:fadeUp 0.45s ease 0.16s both}
        .fade-up-d3{animation:fadeUp 0.45s ease 0.24s both}
        .card{background:#fff;border-radius:14px;border:1px solid #e0d8c8;box-shadow:0 1px 4px rgba(0,0,0,0.04)}
        .card:hover{box-shadow:0 3px 12px rgba(0,0,0,0.07)}
        button:hover{filter:brightness(1.04)}
        input:focus,textarea:focus,select:focus{outline:none;border-color:#2d6a4f!important;box-shadow:0 0 0 3px rgba(45,106,79,0.12)}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-thumb{background:#c8c0b0;border-radius:3px}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .spin{animation:spin 1s linear infinite}
        @media(max-width:640px){.phase-label{display:none}.two-col{flex-direction:column!important}.stat-grid{grid-template-columns:1fr 1fr!important}}
      `}</style>
    </div>
  );
}
