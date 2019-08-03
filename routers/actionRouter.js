const express = require("express");
const db = require("../data/helpers/actionModel.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const actions = await db.get();
  if (actions) {
    res.status(200).json(actions);
  } else {
    next({
      status: 500,
      message: "The actions could not be retrieved."
    });
  }
});

router.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.delete("/:id", validateActionId, async (req, res) => {
  const deletedAction = await db.remove(req.params.id);
  if (deletedAction) {
    res.status(200).json(req.action);
  } else {
    next({
      status: 500,
      message: "The action could not be removed."
    });
  }
});

router.put("/:id", validateActionId, validateAction, async (req, res) => {
  const updatedAction = await db.update(req.params.id, req.body);
  if (updatedAction) {
    res.status(200).json(updatedAction);
  } else {
    next({
      status: 500,
      message: "The action information could not be updated."
    });
  }
});

async function validateActionId(req, res, next) {
  try {
    const { id } = req.params;
    const action = await db.get(id);
    if (action) {
      req.action = action;
      next();
    } else {
      next({
        status: 404,
        message: "The action with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The action information could not be retrieved."
    });
  }
}

function validateAction(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.notes && req.body.description && req.body.project_id) {
      next();
    } else {
      next({
        status: 400,
        message: "missing notes, description, and/or project_id field(s)"
      });
    }
  } else {
    next({
      status: 400,
      message: "missing project data"
    });
  }
}

module.exports = router;
