A service in Timescale is a cloud instance which contains your database.
Each service contains a single database, named `tsdb`.

<Procedure>

### Create a Timescale service

<ol>
  <li>
    <p>
      Sign in to the{" "}
      <a href="https://console.cloud.timescale.com/">Timescale portal and click <code>Create service</code>.</a>.
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
        src="https://assets.timescale.com/docs/images/tsc-create-service-demo.png"
        alt="Create a new service in the Timescale portal"
      />
    </li>
  )}
  <li>
    <p>
      Click <code>Download the cheatsheet</code> to download an SQL file that
      contains the login details for your new service. You can also copy the
      details directly from this page. When you have copied your password,
      click <code>I stored my password, go to service overview</code>
      at the bottom of the page.
    </p>
  </li>
    <li>
    <p>
      When your service is ready to use, is shows a green <code>Running</code>
      label in the Service Overview. You also receive an email confirming that
      your service is ready to use.
    </p>
  </li>
</ol>

</Procedure>
