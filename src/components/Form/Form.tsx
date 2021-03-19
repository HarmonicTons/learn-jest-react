import React from "react";

export const Form: React.FC = () => {
  return (
    <form>
      <div className="card" style={{ padding: "20px" }}>
        <div className="form-group">
          <label htmlFor="inputEmail1" className="required">Example label</label>
          <div className="form-control-container">
            <input
              type="email"
              className="form-control required"
              id="inputEmail1"
              title="Example input"
              placeholder="Example input"
            />
            <span className="form-control-state"></span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="textarea1">Example textarea</label>
          <div className="form-control-container">
            <textarea
              className="form-control "
              id="textarea1"
              placeholder="Example textarea"
            ></textarea>
            <span className="form-control-state"></span>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};
