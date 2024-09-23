const Jobpostingdate = ({ handleChange }) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString().slice(0, 10);
  const sevenDaysAgoDate = sevenDaysAgo.toISOString().slice(0, 10);
  const thirtyDaysAgoDate = thirtyDaysAgo.toISOString().slice(0, 10);

  return (
    <div>
      <h4 className="text-lg mb-2 font-medium">Date of Posting</h4>
      <div>
        <label className="sidebar-label-container">
          <input
            type="radio"
            name="dateFilter"
            value=""
            onChange={handleChange}
          />
          <span className="checkmark"></span>ALL
        </label>

        <Inputfield
          handleChange={handleChange}
          value={twentyFourHoursAgoDate}
          title="Last 24 Hours"
          name="dateFilter"
        />
        <Inputfield
          handleChange={handleChange}
          value={sevenDaysAgoDate}
          title="Last 7 days"
          name="dateFilter"
        />
        <Inputfield
          handleChange={handleChange}
          value={thirtyDaysAgoDate}
          title="Last Thirty Days"
          name="dateFilter"
        />
      </div>
    </div>
  );
};

export default Jobpostingdate;
