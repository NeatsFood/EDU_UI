import React from 'react';
import {
  AreaChart, Brush, ChartContainer, ChartRow, Charts, LabelAxis,
  LineChart, Resizable, ScatterChart, styler, YAxis, ValueAxis, Legend
} from "react-timeseries-charts";
import { TimeRange } from 'pondjs';
import { format } from "d3-format";
import { Spinner } from "reactstrap";

const style = styler([
  { key: "tempData", color: "#008BC2", width: 2 },
  { key: "RHData", color: "#95266A", width: 2 },
  { key: "co2Data", color: "#ecad48", width: 2 },
  { key: "topTempData", color: "green", width: 1, opacity: 0.5 },
  { key: "middleTempData", color: "#cfc793" },
  { key: "bottomTempData", color: "steelblue", width: 1, opacity: 0.5 },
  { key: "leafCount", color: "#000000", radius: 1 },
  { key: "plantHeight", color: "#AA00BB", radius: 1 },
  { key: "ecData", color: "#cfc793" },
  { key: "phData", color: "#333333" }
]);

export class TimeseriesChart extends React.PureComponent {
  constructor(props) {
    super(props);
    const initialRange = new TimeRange([75 * 60 * 1000, 125 * 60 * 1000]);
    const channelNames = ["tempData", "RHData", "co2Data", "leafCount", "plantHeight"];
    const displayChannelNames = [];
    this.state = {
      ready: false,
      noData: false,
      mode: "channels",
      channels: {},
      channelNames,
      displayChannelNames,
      tracker: null,
      timeRange: initialRange,
      brushrange: initialRange
    };
  }

  handleTrackerChanged = t => {
    this.setState({ tracker: t });
  };

  handleActiveChange = channelName => {
    const newChannels = this.state.channels;
    newChannels[channelName].show = !newChannels[channelName].show;
    this.setState({ channels: newChannels });
  };

  handleTimeRangeChange = timeRange => {
    const { channels, displayChannelNames } = this.state;

    if (timeRange) {
      this.setState({ timeRange: timeRange, brushrange: timeRange });
    } else {
      this.setState({ timeRange: channels[displayChannelNames[0]].series.range(), brushrange: null });
    }
  };

  renderMultiAxisChart = () => {

    const { displayChannelNames, channels, timeRange } = this.state;

    const charts = [];
    const axisList = [];
    displayChannelNames.forEach((channelName) => {

      let series = channels[channelName].series;
      const label = channels[channelName].label;
      const max = channels[channelName].max;
      const min = channels[channelName].min;
      const format = channels[channelName].format;
      const id = `${channelName}_axis`;
      const visible = channels[channelName].show;
      if (series !== null) {

        axisList.push(
          <YAxis
            id={id}
            key={id}
            visible={visible}
            label={label}
            min={min}
            max={max}
            width={70}
            type="linear"
            format={format}
            showGrid={true}
          />
        );
        if (channels[channelName].type === "line") {
          charts.push(
            <LineChart
              key={`line-${channelName}`}
              axis={`${channelName}_axis`}
              visible={channels[channelName].show}
              series={series}
              columns={[channelName]}
              style={style}
              interpolation={"curveStepAfter"}
              breakLine
            />
          );
        } else if (channels[channelName].type === "scatter") {
          charts.push(
            <ScatterChart
              key={`scatter-${channelName}`}
              axis={`${channelName}_axis`}
              visible={channels[channelName].show}
              series={series}
              columns={[channelName]}
              style={style}
            />
          );
        }
      }
    });

    const trackerInfoValues = displayChannelNames
      .filter(channelName => channels[channelName].show)
      .map(channelName => {
        const fmt = format(channels[channelName].format);
        let v = "--";
        if (channels[channelName].series !== null) {
          let series = channels[channelName].series.crop(timeRange);

          if (this.state.tracker) {
            const i = series.bisect(new Date(this.state.tracker));
            const vv = series.at(i).get(channelName);
            if (vv) {
              v = fmt(vv);
            }
          }
        }
        const label = channels[channelName].label;
        const value = `${v} ${channels[channelName].units}`;

        return { label, value };
      });

    return (
      <ChartContainer timeRange={timeRange}

        trackerPosition={this.state.tracker}
        onTrackerChanged={this.handleTrackerChanged}
        trackerShowTime>
        <ChartRow height="400"
          trackerInfoValues={trackerInfoValues}
          trackerInfoHeight={10 + trackerInfoValues.length * 16}
          trackerInfoWidth={140}>
          {axisList}
          <Charts>
            {charts}
          </Charts>
        </ChartRow>
      </ChartContainer>
    );
  };

  renderChannelsChart = (channels, timeRange, displayChannelNames) => {
    const rows = [];
    displayChannelNames.forEach((channelName) => {
      const channel = channels[channelName] || null;
      let series = null;
      if (channel !== null) {
        series = channel.series;
      }

      if (series !== null) {
        const summary = [
          { label: "Current", value: channels[channelName].series.atLast().get(channelName) }
        ];

        let value = "--";
        if (this.state.tracker) {
          const fmt = format(channels[channelName].format);
          let shortSeries = series.crop(timeRange);
          const i = shortSeries.bisect(new Date(this.state.tracker)) || null;
          if (i !== null) {
            const seriesAt = shortSeries.at(i);
            const vv = seriesAt.get(channelName);
            if (vv) {
              value = fmt(vv);
            }
          }
        }
        const mainChart = [];
        if (channels[channelName].type === "line") {
          mainChart.push(<LineChart
            key={`line-${channelName}`}
            axis={`${channelName}_axis`}
            series={series}
            columns={[channelName]}
            style={style}
            interpolation={"curveStepAfter"}
            breakLine
          />);
        } else if (channels[channelName].type === "scatter") {
          mainChart.push(<ScatterChart
            key={`scatter-${channelName}`}
            axis={`${channelName}_axis`}
            visible={channels[channelName].show}
            series={series}
            columns={[channelName]}
            style={style}
          />);
        }

        rows.push(
          <ChartRow
            height="100"
            visible={channels[channelName].show}
            key={`row-${channelName}`}
            trackerShowTime={true}
            trackerInfoHeight={16}
            trackerInfoWidth={1}
            trackerInfoValues={[]}
          >
            <LabelAxis
              id={`${channelName}_axis`}
              label={channels[channelName].label}
              values={summary}
              min={channels[channelName].min}
              max={channels[channelName].max}
              width={140}
              type="linear"
              format=",.1f"
            />
            <Charts>
              {mainChart}
            </Charts>
            <ValueAxis
              id={`${channelName}_valueaxis`}
              value={value}
              detail={channels[channelName].units}
              width={80}
              min={0}
              max={35}
            />
          </ChartRow>
        );
      }
    });
    return (
      <ChartContainer
        timeRange={timeRange}
        showGrid={false}
        enablePanZoom
        trackerPosition={this.state.tracker}
        onTimeRangeChanged={this.handleTimeRangeChange}
        onChartResize={width => this.handleChartResize(width)}
        onTrackerChanged={this.handleTrackerChanged}
      >
        {rows}
      </ChartContainer>
    );
  };

  renderBrush = (channels, displayChannelNames) => {
    return (
      <ChartContainer
        timeRange={channels[displayChannelNames[0]].series.range()}
        trackerPosition={this.state.tracker}
      >
        <ChartRow height="100" debug={false}>
          <Brush
            timeRange={this.state.brushrange}
            allowSelectionClear
            onTimeRangeChanged={this.handleTimeRangeChange}
          />
          <YAxis
            id="axis1"
            label={[displayChannelNames[0]].label}
            min={0}
            max={channels[displayChannelNames[0]].max}
            width={70}
            type="linear"
            format="d"
          />
          <Charts>
            <AreaChart
              axis="axis1"
              style={style.areaChartStyle()}
              columns={{ up: [displayChannelNames[0]], down: [] }}
              series={channels[displayChannelNames[0]].series}
            />
          </Charts>
        </ChartRow>
      </ChartContainer>
    );
  };

  render() {
    // Get parameters
    const { telemetry } = this.props.currentData;
    const channels = telemetry.channels || {};
    const timeRange = telemetry.timeRange;
    const ready = telemetry.ready || false;
    const displayChannelNames = Object.keys(channels) || [];
    const noData = displayChannelNames.length < 1; // HACK

    // Check if loading
    if (!ready) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
          <Spinner color="dark" />
        </div>
      )
    }

    // Check for no data
    if (ready && noData) {
      return (
        <div className={"row graphs-row mt-5 mb-5"}>
          <div className="col-md-2 offset-5 text-center">
            No Data For Device
          </div>
        </div>
      )
    }

    // Initialize legend
    const legend = displayChannelNames.map(channelName => ({
      key: channelName,
      label: channels[channelName].label,
      disabled: !channels[channelName].show
    }));

    // Render component
    return (
      <div>
        <div className="row graphs-row mt-5 mb-5">
          <div className="col-md-10">
            <Resizable>
              {this.renderChannelsChart(channels, timeRange, displayChannelNames)}
            </Resizable>
          </div>
          <div className="col-md-2">
            <div className={"card"}>
              <div className={"card-body"}>
                <div className={"card-title"}>
                  <h6>Legend</h6>
                </div>
                <div className={"card-text"}>
                  <Legend
                    type="swatch"
                    align="left"
                    stack={true}
                    style={style}
                    categories={legend}
                    onSelectionChange={this.handleActiveChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"row graphs-row mt-5 mb-5"}>
          <div className={"col-md-10"}>
            <Resizable>
              {this.renderBrush(channels, displayChannelNames)}
            </Resizable>
          </div>
        </div>
      </div>
    )
  }
}
