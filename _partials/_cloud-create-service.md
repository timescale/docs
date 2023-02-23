A service in Timescale Cloud is a cloud instance which contains your database.
Each service contains a single database, named `tsdb`.

<Procedure>

### Create a Timescale Cloud service

<ol>
  <li>
    <p>
      Sign in to the{" "}
      <a href="https://console.cloud.timescale.com/">Timescale Cloud portal</a>.
    </p>
  </li>
  <li>
    <p>
      {" "}
      {props.demoData ? (
        <>
          If this is your first service, we recommend that you choose the
          option to deploy a service with a {" "}
          <code>demo dataset</code>, because it is the best way to see how
          Timescale Cloud works in the real world.
        </>
      ) : (
        <>
          Click <code>Create service</code>.
        </>
      )}
    </p>
  </li>
  {props.demoData && (
    <li>
      <p>
        Click <code>Get started</code> to create your service with demo data, and
        launch the <code>Allmilk Factory</code> interactive demo. You can exit
        the demo at any time, and revisit it from the same point later on. You
        can also re-run the demo after you have completed it.
      </p>
      <img
        class="main-content__illustration"
        src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-create-service-demo.png"
        alt="Create a new service in the Timescale Cloud portal"
      />
    </li>
  )}
</ol>

</Procedure>
