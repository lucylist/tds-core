### Minimal Usage

By default, a "text" input field will be rendered, but other types are also supported.

```
<div>
  <Input label="First name" value="Lucy" />

  <Input type="number" label="Age" value="35" />
  <Input type="password" label="Tax ID" value="123456789" />
</div>
```

### Disabling an input

```
<Input label="Address" disabled />
```

### Showing feedback for entered values

Use the `feedback` attribute to give the user feedback regarding their input. You can affirm that the user's input
was correct, or highlight errors that must be corrected.

```
<div>
  <Input label="Username" value="guest12345" feedback="success" />
  <Input
    label="Email" value="guest@telus.com" feedback="error"
    error="That email is already associated with another account. Choose another one."
  />
</div>
```

TDS does not perform input validations, as that is an application level concern. You will need to track the value of your
input fields and perform any required data validations either client side or server side, depending on the context.

Here is an example. Enter a value into the field below, then click away to lose focus. If you enter less than 10
characters you will receive an error message. Enter 10 or more characters to receive the success feedback.

```
initialState = {
  value: '',
  status: undefined,
  errorMessage: undefined
};

const updateValue = (event) => {
  setState({ value: event.target.value })
}

const validate = (event) => {
  const value = event.target.value

  if (value.length < 10) {
    setState({
      status: 'error',
      errorMessage: 'Your name must be greater than 10 characters'
    })
  }
  else {
    setState({
      status: 'success',
      errorMessage: undefined
    })
  }
};

<div>
  <Input
    label="Name" value={state.value}
    feedback={state.status} error={state.errorMessage}
    onChange={updateValue} onBlur={validate}
  />
</div>
```

### Supplying extra information

Use a `helper` to offer the user a detailed explanation of the input expected by a form field. Use the `Input.Helper`
component, which can contain any content.

```
const creditCards = (
  <Paragraph>
    We accept the following credit cards: <Text bold>Visa, Mastercard, Discover</Text>.
  </Paragraph>
);

<Input label="Credit Card Number" helper={creditCards} />
```

The helper will also receive the feedback state and will be styled accordingly in response to user input. Use the
typography components to ensure any color changes are inherited.

Here is an example. Enter a value into the field below, then click away to lose focus. If you enter less than the 16
character minimum the helper will show as an error. Enter 16 or more characters to receive the success feedback.

```
initialState = {
  value: '',
  status: undefined,
}

const updateValue = (event) => {
  setState({ value: event.target.value })
}

const validate = (event) => {
  const value = event.target.value

  if (value.length < 16) {
    setState({ status: 'error' })
  }
  else {
    setState({ status: 'success' })
  }
}

const passwordRequirements = (feedback) => {
  let listType

  switch(feedback) {
    case 'success': listType = 'list--checked'; break;
    case 'error': listType = 'list--error'; break;
    default: listType = 'list--compact'
  }

  return (
    <Input.Helper feedback={feedback}>
      <Paragraph bold>Your password must be:</Paragraph>

      <ul className={`list ${listType}`}>
        <li className="list__item">16 characters or longer</li>
        <li className="list__item">Not repeated from previous password</li>
      </ul>
    </Input.Helper>
  );
};

<div>
  <Input
    label="Password" type="password" id="password-2"
    value={state.value} feedback={state.status}
    onChange={updateValue} onBlur={validate}
    helper={passwordRequirements}
  />
</div>
```