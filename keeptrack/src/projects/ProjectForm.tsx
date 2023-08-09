import React, { SyntheticEvent, useEffect, useState } from "react";
import { Project } from "./Project";

interface ProjectFormProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

function ProjectForm({
  project: initialProject,
  onSave,
  onCancel,
}: ProjectFormProps) {
  const [project, setProject] = useState(initialProject);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    budget: "",
  });

  function validate(project: Project) {
    let errors: any = { name: "", description: "", budget: "" };
    if (project.name.length === 0) {
      errors.name = "Names is required.";
    }
    if (project.name.length > 0 && project.name.length < 3) {
      errors.name = "Name needs to be atleast 3 characters.";
    }
    if (project.description.length === 0) {
      errors.description = "Description is required.";
    }
    if (project.budget === 0) {
      errors.budget = "Budget must be more than $0";
    }
    return errors;
  }

  function isValid() {
    return (
      errors.name.length === 0 &&
      errors.budget.length === 0 &&
      errors.description.length === 0
    );
  }
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!isValid()) {
      return;
    }
    onSave(project);
  };

  function handleChange(event: any) {
    const { type, name, value, checked } = event.target;
    let updateValue = type === "checkbox" ? checked : value;
    if (type === "number") {
      updateValue = Number(updateValue);
    }
    const change = {
      [name]: updateValue,
    };
    let updatedProject: Project;
    setProject((p) => {
      updatedProject = new Project({ ...p, ...change });
      console.log("updated project:", updatedProject);
      return updatedProject;
    });
    setErrors(() => validate(updatedProject));
  }
  return (
    <form className="input-group vertical">
      <label htmlFor="name">Project Name</label>
      <input
        type="text"
        name="name"
        placeholder="enter name"
        value={project.name}
        onChange={handleChange}
      />
      {errors.name.length > 0 && (
        <div className="card error">
          <p>{errors.name}</p>
        </div>
      )}
      <label htmlFor="description">Project Description</label>
      <textarea
        name="description"
        placeholder="enter description"
        value={project.description}
        onChange={handleChange}
      />
      {errors.description.length > 0 && (
        <div className="card error">
          <p>{errors.description}</p>
        </div>
      )}
      <label htmlFor="budget">Project Budget</label>
      <input
        type="number"
        name="budget"
        placeholder="enter budget"
        value={project.budget}
        onChange={handleChange}
      />
      {errors.budget.length > 0 && (
        <div className="card error">
          <p>{errors.budget}</p>
        </div>
      )}
      <label htmlFor="isActive">Active?</label>
      <input type="checkbox" name="isActive" />
      <div className="input-group">
        <button className="primary bordered medium" onClick={handleSubmit}>
          Save
        </button>
        <span />
        <button type="button" className="bordered medium" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;
