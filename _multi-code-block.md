{/* Note the spacing and labeling are very important! */}
<Terminal>

<tab label='ruby'>

```ruby
class AddTimescale < ActiveRecord::Migration[5.2]
  def change
    enable_extension("timescaledb") unless extensions.include? "timescaledb"
  end
end
```

</tab>

<tab label="python-1">

```python
def start:
  if this:
    return

```

</tab>

<tab label="python-2">

```python
def different_python:
  return

```

</tab>

</Terminal>
