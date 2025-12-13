const { response } = require("express");

const Medico = require("../models/medico");

const getMedicos = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const [medicos, total] = await Promise.all([
    Medico.find({}, "usuario hospital nombre img")
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img")
      .skip(desde)
      .limit(5),
    Medico.countDocuments(),
  ]);
  res.json({
    ok: true,
    medicos,
    total,
  });
};

const getMedicoById = async (req, res = response) => {
  const id = req.params.id;
  try {
    const medico = await Medico.findById(id)
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");
    res.json({
      ok: true,
      medico,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body,
  });
  try {
    const medicoDB = await medico.save();

    res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarMedico = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;
  const hospitalId = req.params.hospitalId;
  console.log(hospitalId);
  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: true,
        msg: "Medico no encontrado por id",
      });
    }
    const cambiosMedico = { ...req.body, hospital: hospitalId, usuario: uid };
    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true }
    );
    res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarMedico = async (req, res = response) => {
  const id = req.params.id;
  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: true,
        msg: "Medico no encontrado por id",
      });
    }
    const medicoBorrado = await Medico.findByIdAndDelete(id);
    res.json({
      ok: true,
      medicoBorrado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
  getMedicoById,
};
