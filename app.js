// Librerías y dependencias
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const JsonFileAdapter = require('@bot-whatsapp/database/json');

// Utilidades
const isYes = (text) => ['1', 'sí', 'si'].includes(text.trim().toLowerCase());
const isNo = (text) => ['2', 'no'].includes(text.trim().toLowerCase());


// Flujo Principal
const flowPrincipal = addKeyword([
  'hola', 'buenas', 'buen día', 'buenos dias', 'buenas tardes', 'buenas noches', 'ola', 'saludos', 'ayuda'
])
  .addAnswer('☀️ ¡Hola! Soy Lety, tu asistente del Soporte Fotovoltaico de Energitel. ¿En qué puedo ayudarte? 🤖. 📢También puedes conocernos más y seguir nuestras novedades en:\n 📸Instagram: https://acortar.link/#google_vignette\n 🌐Facebook: https://acortar.link/MyfnS5\n ▶️YouTube: https://www.youtube.com/@energitels.a.s235\n 🖥️Sitio web: https://energitelsolar.com/ 💼LinkedIn: https://www.linkedin.com/in/energitel-s-a-s-360b0814a/')
  .addAnswer(
    `Por favor selecciona una opción: 
1. 🌞 Soporte Técnico por fallas en inversores  
2. 💼 Área Comercial, Cotizaciones, productos y asesoría personalizada  
3. 📞 Telecomunicaciones, Servicios, soporte y consultas técnicas  
4. 🔧 Agendar Mantenimiento`,
    { capture: true }
  )
  .addAction(async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
    const txt = ctx.body.trim();
    if (txt === '1') return gotoFlow(flowSoporteTecnico);
    if (txt === '2') return gotoFlow(flowComercial);
    if (txt === '3') return gotoFlow(flowTelecomunicaciones);
    if (txt === '4') return gotoFlow(flowAgendarMantenimiento);

    await flowDynamic('❌ Por favor escribe "1", "2", "3" o "4".');
    return fallBack();
  });


// Soporte Técnico
const flowSoporteTecnico = addKeyword(['1', 'soporte'])
  .addAnswer('Seleccionaste Soporte Técnico.')
  .addAction(async (_, { gotoFlow }) => {
    return gotoFlow(flowTipoDeSoporteTecnico);
  });

// Submenú Soporte Técnico
const flowTipoDeSoporteTecnico = addKeyword(['__tipo_soporte__'])
  .addAnswer(
    'Selecciona una opción:\n1️⃣ Soporte Técnico por fallas\n2️⃣ Ayuda con configuración\n3️⃣ Hablar con un asesor\n4️⃣ 🔙 Volver',
    { capture: true }
  )
  .addAction(async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
    const op = ctx.body.trim();
    if (op === '1') return gotoFlow(flowSeleccionInversor);
    if (op === '2') {
      await flowDynamic('⚙️ Para ayuda con configuración, por favor selecciona tu inversor y consulta los manuales disponibles.');
      return gotoFlow(flowSeleccionInversor);
    }
    if (op === '3') {
      await flowDynamic('📨 Un asesor se comunicará contigo en breve. También puedes enviar un ticket: https://acortar.link/R1M3xs');
      return gotoFlow(flowDeseaMasAyuda);
    }
    if (op === '4') return gotoFlow(flowPrincipal);

    await flowDynamic('❌ Opción no válida. Escribe del 1 al 4.');
    return fallBack();
  });

// Selección de Inversor
const flowSeleccionInversor = addKeyword(['__elegir_inversor__'])
  .addAnswer(
    '¿Qué tipo de inversor estás utilizando? \n1. Solis\n2. Livoltek\n3. 🔙 Volver',
    { capture: true }
  )
  .addAction(async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
    const r = ctx.body.trim();
    if (r === '1') return gotoFlow(flowSolisMenu);
    if (r === '2') return gotoFlow(flowLivoltekMenu);
    if (r === '3') return gotoFlow(flowTipoDeSoporteTecnico);

    await flowDynamic('❌ Por favor escribe "1", "2" o "3".');
    return fallBack();
  });

// Menú Solis
const flowSolisMenu = addKeyword(['soporte solis', '1'])
  .addAnswer('Elegiste soporte para inversores Solis.')
  .addAnswer(
    'Elige una opción:\n1. Manuales y descarga\n2. Alarmas / códigos de error\n3. Otro problema (enviar un ticket)\n4. 🔙 Volver',
    { capture: true }
  )
  .addAction(async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
    const op = ctx.body.trim();
    if (op === '1') {
      await flowDynamic('📄 Manuales: https://www.solisinverters.com/mx/downloadcenter.html');
      return gotoFlow(flowDeseaMasAyuda);
    }
    if (op === '2') {
      await flowDynamic('📟 Alarmas: https://acortar.link/UAycao');
      return gotoFlow(flowDeseaMasAyuda);
    }
    if (op === '3') {
      await flowDynamic('📨 Para otros problemas con inversores Solis, envia un ticket: https://acortar.link/R1M3xs');
      return gotoFlow(flowDeseaMasAyuda);
    }
    if (op === '4') return gotoFlow(flowSeleccionInversor);

    await flowDynamic('❌ Opción no válida. Escribe del 1 al 4.');
    return fallBack();
  });

// Menú Livoltek
const flowLivoltekMenu = addKeyword(['2', 'livoltek'])
  .addAnswer('Elegiste soporte para inversores Livoltek.')
  .addAnswer(
    'Elige una opción:\n1. Manuales y descarga\n2. Alarmas / códigos de error\n3. Otro problema (enviar un ticket)\n4. 🔙 Volver',
    { capture: true }
  )
  .addAction(async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
    const op = ctx.body.trim();
    if (op === '1') {
      await flowDynamic('📄 Manuales: https://cl.livoltek.com/download-center/');
      return gotoFlow(flowDeseaMasAyuda);
    }
    if (op === '2') {
      await flowDynamic('📟 Alarmas: https://cl.livoltek.com/download-center/');
      return gotoFlow(flowDeseaMasAyuda);
    }
    if (op === '3') {
      await flowDynamic('📨 Para otros problemas con inversores Livoltek, por favor envía un ticket: https://acortar.link/R1M3xs');
      return gotoFlow(flowDeseaMasAyuda);
    }
    if (op === '4') return gotoFlow(flowSeleccionInversor);

    await flowDynamic('❌ Opción no válida. Escribe del 1 al 4.');
    return fallBack();
  });

// Pregunta si desea más ayuda
const flowDeseaMasAyuda = addKeyword(['__mas_ayuda__'])
  .addAnswer('¿Deseas más ayuda? (Sí / No)', { capture: true })
  .addAction(async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
    const r = ctx.body.trim().toLowerCase();

    if (isYes(r)) return gotoFlow(flowPrincipal);

    if (isNo(r)) {
      await flowDynamic([
        '🙏 Gracias por comunicarte con Energitel. ¡Que tengas un excelente día! 👋',
        'Si deseas volver al menú principal, solo escribe *hola*.'
      ]);
      return;
    }

    await flowDynamic('❌ Por favor responde con "Sí" o "No".');
    return fallBack();
  });

// Flujo para agendar mantenimiento
const flowAgendarMantenimiento = addKeyword(['4', 'agendar', 'mantenimiento'])
  .addAnswer('¿Deseas agendar mantenimiento? (Sí / No)', { capture: true })
  .addAction(async (ctx, { flowDynamic }) => {
    const res = ctx.body.trim().toLowerCase();

    if (isYes(res)) {
      await flowDynamic('📅 Por favor envía un ticket: https://acortar.link/R1M3xs.');
      return;
    }

    if (isNo(res)) {
      await flowDynamic('👌 Entendido. Aquí estoy si cambias de idea.');
      return;
    }

    await flowDynamic('❌ Responde con "Sí" o "No".');
    return;
  });

// Atención Comercial
const flowComercial = addKeyword(['comercial'])
  .addAnswer('👉 Atención Comercial: https://wa.link/bgxxfy')
  .addAnswer('🔙 Escribe "hola" para volver al inicio.', { capture: true })
  .addAction(async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
    if (ctx.body.trim().toLowerCase() === 'hola') {
      return gotoFlow(flowPrincipal); // 🔙 Forzar regreso al menú principal
    }
    await flowDynamic('⚠️ Para volver al menú principal escribe *hola*.');
    return fallBack();
  });

// Atención Telecomunicaciones
const flowTelecomunicaciones = addKeyword(['telecomunicaciones'])
  .addAnswer('👉 Atención Telecomunicaciones: https://wa.link/h2bpyg')
  .addAnswer('🔙 Escribe "hola" para volver al inicio.', { capture: true })
  .addAction(async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
    if (ctx.body.trim().toLowerCase() === 'hola') {
      return gotoFlow(flowPrincipal); // 🔙 Forzar regreso al menú principal
    }
    await flowDynamic('⚠️ Para volver al menú principal escribe *hola*.');
    return fallBack();
  });

// Inicializar bot
const main = async () => {
  const adapterDB = new JsonFileAdapter();
  const adapterFlow = createFlow([
    flowPrincipal,
    flowComercial,
    flowTelecomunicaciones,
    flowAgendarMantenimiento,
    flowSoporteTecnico,
    flowTipoDeSoporteTecnico,
    flowSeleccionInversor,
    flowSolisMenu,
    flowLivoltekMenu,
    flowDeseaMasAyuda
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  });

  QRPortalWeb();
};

main();
