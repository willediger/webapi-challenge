const express = require("express");

const router = express.Router();
const db = require("../data/helpers/projectModel.js");
const actionDb = require("../data/helpers/actionModel.js");

router.post("/", validateProject, async (req, res) => {
  const project = await db.insert(req.body);
  if (project) {
    res.status(200).json(project);
  } else {
    next({
      status: 500,
      message: "The project could not be added."
    });
  }
});

router.post(
  "/:id/actions",
  validateProjectId,
  validateAction,
  async (req, res) => {
    const actionToAdd = { project_id: req.params.id, ...req.body };
    const action = await actionDb.insert(actionToAdd);
    if (action) {
      res.status(200).json(action);
    } else {
      next({
        status: 500,
        message: "The action could not be added."
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const projects = await db.get();
    res.status(200).json(projects);
  } catch {
    next({
      status: 500,
      message: "The projects could not be retrieved."
    });
  }
});

router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", validateProjectId, async (req, res) => {
  const actions = await db.getProjectActions(req.params.id);
  if (actions) {
    res.status(200).json(actions);
  } else {
    next({
      status: 500,
      message: "The project's actions could not be retrieved."
    });
  }
});

router.delete("/:id", validateProjectId, async (req, res) => {
  const deletedProject = await db.remove(req.params.id);
  if (deletedProject) {
    res.status(200).json(req.project);
  } else {
    next({
      status: 500,
      message: "The project information could not be removed."
    });
  }
});

router.put("/:id", validateProjectId, validateProject, async (req, res) => {
  const updatedProject = await db.update(req.params.id, req.body);
  if (updatedProject) {
    res.status(200).json(updatedProject);
  } else {
    next({
      status: 500,
      message: "The project information could not be updated."
    });
  }
});

async function validateProjectId(req, res, next) {
  try {
    const { id } = req.params;
    const project = await db.get(id);
    if (project) {
      req.project = project;
      next();
    } else {
      next({
        status: 404,
        message: "The project with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The project information could not be retrieved."
    });
  }
}

function validateProject(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.name && req.body.description) {
      next();
    }
    if (!req.body.name && req.body.description) {
      next({
        status: 400,
        message: "missing required name field"
      });
    }
    if (!req.body.name && req.body.description) {
      next({
        status: 400,
        message: "missing required description field"
      });
    }
    if (!req.body.name && !req.body.description) {
      next({
        status: 400,
        message: "missing required name & description fields"
      });
    }
  } else {
    next({
      status: 400,
      message: "missing project data"
    });
  }
}

function validateAction(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.notes && req.body.description) {
      next();
    }
    if (!req.body.notes && req.body.description) {
      next({
        status: 400,
        message: "missing required notes field"
      });
    }
    if (!req.body.notes && req.body.description) {
      next({
        status: 400,
        message: "missing required description field"
      });
    }
    if (!req.body.notes && !req.body.description) {
      next({
        status: 400,
        message: "missing required notes & description fields"
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
