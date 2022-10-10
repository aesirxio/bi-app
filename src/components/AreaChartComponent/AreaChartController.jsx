import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

const AreaChartController = ({ chartTitle }) => {
  return (
    <div className="d-flex justify-content-between mb-24">
      <h5>{chartTitle}</h5>

      <ButtonGroup>
        <Button className="py-1 px-15 fs-12" variant="outline-secondary">
          Hours
        </Button>
        <Button className="py-1 px-15 fs-12" variant="outline-secondary">
          Days
        </Button>
        <Button className="py-1 px-15 fs-12" variant="outline-secondary">
          Weeks
        </Button>
        <Button className="py-1 px-15 fs-12" variant="secondary">
          Month
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default AreaChartController;
