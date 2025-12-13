const { response } = require("express");

const Hospital = require("../models/hospital");

const getHospitales = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const [hospitales, total] = await Promise.all([
    Hospital.find({}, "usuario nombre img")
      .populate("usuario", "nombre email img")
      .skip(desde)
      .limit(5),
    Hospital.countDocuments(),
  ]);
  res.json({
    ok: true,
    hospitales,
    total,
  });
};

const crearHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({
    usuario: uid,
    ...req.body,
  });

  try {
    const hospitalDB = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: true,
        msg: "Hospital no encontrado por id",
      });
    }

    const cambiosHospital = {
      ...req.body,
      usuario: uid,
    };

    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      cambiosHospital,
      { new: true },
    );

    res.json({
      ok: true,
      hospital: hospitalActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarHospital = async (req, res = response) => {
  const id = req.params.id;

  try {
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: true,
        msg: "Hospital no encontrado por id",
      });
    }
    const hospitalBorrado = await Hospital.findByIdAndDelete(id);
    res.json({
      ok: true,
      hospitalBorrado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
