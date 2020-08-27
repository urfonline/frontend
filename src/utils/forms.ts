export function formToMutation(form: HTMLFormElement): any {
  let elements = form.elements;
  let variables: any = {};

  for (let i = 0; i < elements.length; i++) {
    let element: any = elements[i];
    let name = element.name;

    if (element.type == 'checkbox')
      variables[name] = element.checked;
    else
      variables[name] = element.value;
  }

  return variables;
}
