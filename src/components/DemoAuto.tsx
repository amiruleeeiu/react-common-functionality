"use client";

import {
  Combobox,
  Field,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";
import { useState } from "react";

const DemoAuto = () => {
  const { contains } = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  });

  const [inputValue, setInputValue] = useState("");

  const handleFocus = () => {
    // Force show all items when focused
    filter(""); // empty filter = all items
    setInputValue(""); // reset input value to show full list
  };

  return (
    <Field.Root width="320px">
      <Field.Label>Select framework</Field.Label>
      <Combobox.Root
        collection={collection}
        inputValue={inputValue}
        onInputValueChange={(e) => {
          filter(e.inputValue);
          setInputValue(e.inputValue);
        }}
      >
        <Combobox.Control>
          <Combobox.Input
            placeholder="Type to search"
            onFocus={handleFocus} // 👈 triggers dropdown on focus
          />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>

        <Field.HelperText>The framework you love to use</Field.HelperText>

        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.Empty>No items found</Combobox.Empty>
              {collection.items.map((item) => (
                <Combobox.Item item={item} key={item.value}>
                  {item.label}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </Field.Root>
  );
};

export default DemoAuto;

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
];
