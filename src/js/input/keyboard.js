let DOWN = {};
onkeydown = e => DOWN[e.code] = true;
onkeyup = e => DOWN[e.code] = false;
